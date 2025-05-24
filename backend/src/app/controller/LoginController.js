require('dotenv').config()

const { pool } = require('../../../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

class LoginController
{
    // [POST] /login
    async login(req, res, next) {
        const { username, password } = req.body

        try {
            const userQuery = `SELECT * FROM member_information WHERE username = $1;`
            const userResult = await pool.query(userQuery, [username])
            const userLogin = userResult.rows[0]

            if (!userLogin) {
                return res.status(401).json({ 
                    message: 'This username doesn\'t exist.' 
                })
            }

            const isMatch = await bcrypt.compare(password, userLogin.password)

            if (!isMatch) {
                return res.status(401).json({ 
                    message: 'Password is incorrect.' 
                })
            }

            let userLoginQuery = `
            SELECT mi.*, rs.*, br.name AS brand_name, br.id AS brand_id
            FROM rcms_staff rs
            LEFT JOIN member_information mi ON rs.member_information_id = mi.id
            LEFT JOIN brand br ON br.id = rs.brand_id WHERE mi.username = $1;
            `
            let userLoginResult = await pool.query(userLoginQuery, [username])

            if (userLoginResult.rows.length === 0) {
                userLoginQuery = `
                SELECT mi.*, s.*, br.name AS brand_name, bra.address AS branch_address, br.id AS brand_id
                FROM staff s
                LEFT JOIN member_information mi ON s.member_information_id = mi.id
                LEFT JOIN branch bra ON bra.id = s.branch_id 
                LEFT JOIN brand br ON br.id = bra.brand_id WHERE mi.username = $1;
                `
                userLoginResult = await pool.query(userLoginQuery, [username])

                if (userLoginResult.rows.length === 0) {
                    userLoginQuery = `
                    SELECT mi.*, c.*, br.name AS brand_name, br.id AS brand_id
                    FROM customer c
                    LEFT JOIN member_information mi ON c.member_information_id = mi.id
                    LEFT JOIN brand br ON br.id = c.brand_id WHERE mi.username = $1;
                    `
                    userLoginResult = await pool.query(userLoginQuery, [username])
                }
            } 

            const token = jwt.sign({
                id: userLoginResult.rows[0].id,
                username: userLoginResult.rows[0].username,
                full_name: userLoginResult.rows[0].full_name, 
                role: userLoginResult.rows[0].role,
                brand_id: userLoginResult.rows[0].brand_id,
                branch_id: userLoginResult.rows[0].branch_id,
                brand_name: userLoginResult.rows[0].brand_name,
                branch_address: userLoginResult.rows[0].branch_address,
                rcms_id: userLoginResult.rows[0].rcms_id
            }, process.env.SECRET_KEY, { expiresIn: '24h' })

            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    id: userLoginResult.rows[0].id,
                    username: userLoginResult.rows[0].username,
                    full_name: userLoginResult.rows[0].full_name,
                    role: userLoginResult.rows[0].role,
                    brand_id: userLoginResult.rows[0].brand_id,
                    branch_id: userLoginResult.rows[0].branch_id,
                    brand_name: userLoginResult.rows[0].brand_name,
                    branch_address: userLoginResult.rows[0].branch_address,
                    rcms_id: userLoginResult.rows[0].rcms_id
                }
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /login/forgot_password
    async forgotPassword(req, res, next) {
        const { email } = req.body;

        try {
            const userRes = await pool.query('SELECT * FROM member_information WHERE email = $1', [email]);
            if (userRes.rowCount === 0) {
                return res.status(404).json({ message: 'Email not found' });
            }

            const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric code
            const expires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

            await pool.query(
                'UPDATE member_information SET reset_code = $1, reset_code_expires = $2 WHERE email = $3',
                [token, expires, email]
            );

            // Nodemailer: Configure transport
            const transporter = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                    user: 'homanhquan1812@gmail.com',
                    pass: 'cuhu clwy pawy sabd'
                }
            });

            await transporter.sendMail({
                from: '"UTOPIA" <homanhquan1812@gmail.com>',
                to: email,
                subject: 'Your Password Reset Code on UTOPIA',
                html: `<p>Your password reset code is <b>${token}</b>. It expires in 10 minutes.</p>`
            });

            res.json({ 
                message: 'Verification code sent to email.',
                email: email // Return email to maintain state across UI steps
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /login/verify_reset_code
    async verifyResetCode(req, res, next) {
        const { email, code } = req.body;
        
        try {
            const userRes = await pool.query(
                'SELECT reset_code, reset_code_expires FROM member_information WHERE email = $1',
                [email]
            );

            if (userRes.rowCount === 0) {
                return res.status(404).json({ message: 'Email not found' });
            }

            const user = userRes.rows[0];
            const now = Date.now();

            if (user.reset_code !== code || now > Number(user.reset_code_expires)) {
                return res.status(400).json({ message: 'Invalid or expired code' });
            }

            // Generate a shorter verification token (8 chars) to fit in VARCHAR(10)
            // Use a combination of digits for simplicity
            const verificationToken = Math.floor(10000000 + Math.random() * 90000000).toString();
            
            // Update the reset_code to our verification token, keeping the same expiration
            await pool.query(
                'UPDATE member_information SET reset_code = $1 WHERE email = $2',
                [verificationToken, email]
            );

            res.json({ 
                message: 'Code verified successfully',
                email: email,
                token: verificationToken // This token will be used in the final step
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /login/reset_password
    async resetPassword(req, res, next) {
        const { email, token, newPassword, confirmPassword } = req.body;
        
        // Validate that passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        
        try {
            const userRes = await pool.query(
                'SELECT reset_code, reset_code_expires FROM member_information WHERE email = $1',
                [email]
            );

            if (userRes.rowCount === 0) {
                return res.status(404).json({ message: 'Invalid email' });
            }

            const user = userRes.rows[0];
            const now = Date.now();

            // Verify the token matches our stored verification hash
            if (user.reset_code !== token || now > Number(user.reset_code_expires)) {
                return res.status(400).json({ message: 'Invalid or expired verification token' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query(
                'UPDATE member_information SET password = $1, reset_code = NULL, reset_code_expires = NULL WHERE email = $2',
                [hashedPassword, email]
            );

            res.json({ message: 'Password reset successfully' });
        } catch (error) {
            next(error);
        }
    }
    /* Email sending
    async resetPassword(req, res, next) {
        const { token, newPassword } = req.body;

        try {
            const userRes = await pool.query(
                'SELECT * FROM member_information WHERE reset_token = $1 AND reset_token_expires > $2',
                [token, Date.now()]
            );

            if (userRes.rowCount === 0) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query(
                `UPDATE member_information
                SET password = $1, reset_token = NULL, reset_token_expires = NULL
                WHERE id = $2`,
                [hashedPassword, userRes.rows[0].id]
            );

            res.json({ message: 'Password has been reset.' });
        } catch (error) {
            next(error)
        }
    }
    */
}

module.exports = new LoginController