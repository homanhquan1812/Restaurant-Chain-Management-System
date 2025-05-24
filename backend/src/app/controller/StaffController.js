require('dotenv').config()

const { pool } = require('../../../config/db')
const bcrypt = require('bcrypt')
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('avatar'); // 'avatar' is the field name in your form

// Promise wrapper for multer upload
const handleUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

class StaffController
{
    // [GET] /staff
    async readAllStaffs(req, res, next) {
        try {
            let staffQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY mi.date_added)::TEXT, 8, '0') AS display_id, 
                    s.id,
                    s.member_information_id,
                    s.branch_id,
                    s.position,
                    s.avatar,
                    s.salary,
                    mi.full_name,
                    mi.username,
                    mi.role,
                    mi.dob,
                    mi.email,
                    mi.phone,
                    mi.gender,
                    mi.address,
                    mi.date_added,
                    br.name AS brand_name, 
                    bra.address AS branch_address, 
                    br.logo_url
                FROM staff s
                JOIN member_information mi ON s.member_information_id = mi.id
                LEFT JOIN branch bra ON bra.id = s.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
            `;

            const conditions = [];
            const values = [];

            if (req.query.brand_name) {
                conditions.push(`br.name ILIKE $${values.length + 1}`);
                values.push(`%${req.query.brand_name}%`);
            }

            if (req.query.address) {
                conditions.push(`bra.address ILIKE $${values.length + 1}`);
                values.push(`%${req.query.address}%`);
            }

            if (conditions.length > 0) {
                staffQuery += ` WHERE ` + conditions.join(' AND ');
            }

            staffQuery += ` ORDER BY mi.date_added DESC`;

            const staffResult = await pool.query(staffQuery, values);

            res.status(200).json({
                staff: staffResult.rows
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /staff/:id
    async readAStaff(req, res, next) {
        try {
            const id = req.params.id
            const staffQuery = `SELECT 
                LPAD(ROW_NUMBER() OVER (ORDER BY mi.date_added)::TEXT, 8, '0') AS display_id, 
                s.id,
                s.member_information_id,
                s.branch_id,
                s.position,
                s.avatar,
                s.salary,
                mi.full_name,
                mi.username,
                mi.role,
                mi.dob,
                mi.email,
                mi.phone,
                mi.gender,
                mi.address,
                mi.date_added,
                br.name AS brand_name, 
                bra.address AS branch_address, 
                br.logo_url
            FROM staff s
            JOIN member_information mi ON s.member_information_id = mi.id
            LEFT JOIN branch bra ON bra.id = s.branch_id
            LEFT JOIN brand br ON br.id = bra.brand_id WHERE s.id = $1`
            const staffResult = await pool.query(staffQuery, [id])

            res.status(200).json({
                staff: staffResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /staff/:id
    async putAStaff(req, res, next) {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { full_name, username, password, email, phone, address, position, salary, gender, avatar, dob, branch_id } = req.body;
            const id = req.params.id;
            
            // Process the uploaded avatar file if exists
            let finalAvatar = avatar; // Use the provided avatar string if no file uploaded
            
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64');
                finalAvatar = `data:${req.file.mimetype};base64,${base64Image}`;
            }
            
            const client = await pool.connect();

            try {
                await client.query('BEGIN');
                const updateMemberQuery = `
                    UPDATE member_information
                    SET 
                        full_name = COALESCE($1, member_information.full_name),
                        username = COALESCE($2, member_information.username),
                        password = COALESCE($3, member_information.password),
                        email = COALESCE($4, member_information.email),
                        phone = COALESCE($5, member_information.phone),
                        gender = COALESCE($6, member_information.gender),
                        address = COALESCE($7, member_information.address),
                        dob = COALESCE($8, member_information.dob)
                    FROM staff
                    WHERE staff.member_information_id = member_information.id
                    AND staff.id = $9
                `;
                
                let hashedPassword = null;
                if (password) {
                    hashedPassword = await bcrypt.hash(password, 10);
                }
                
                await client.query(updateMemberQuery, [full_name, username, hashedPassword, email, phone, gender, address, dob, id]);

                const updateStaffQuery = `
                    UPDATE staff
                    SET position = COALESCE($1, staff.position),
                        avatar = COALESCE($2, staff.avatar),
                        salary = COALESCE($3, staff.salary),
                        branch_id = COALESCE($4, staff.branch_id)
                    WHERE id = $5
                `;
                
                await client.query(updateStaffQuery, [position, finalAvatar, salary, branch_id, id]);

                const selectMemberQuery = `
                    SELECT * FROM member_information
                    INNER JOIN staff ON staff.member_information_id = member_information.id
                    WHERE staff.id = $1
                `;
                
                const result = await client.query(selectMemberQuery, [id]);

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    return res.status(404).json({ 
                        message: "This ID doesn't exist." 
                    });
                }

                const updatedUser = result.rows[0];
                await client.query('COMMIT');

                res.status(200).json({
                    message: "Information updated successfully.",
                    updatedUser: updatedUser
                });
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /staff/:id
    async deleteAStaff(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM staff WHERE id = $1'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Staff deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Staff not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new StaffController