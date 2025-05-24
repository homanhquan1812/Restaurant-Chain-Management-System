require('dotenv').config()

const bcrypt = require('bcrypt')
const { pool } = require('../../../config/db')
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

class RegisterController
{
    // [POST] /register/rcms_staff
    async rcmsStaffRegister(req, res, next)
    {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { full_name, username, password, email, phone, gender, address, salary, avatar, brand_id, dob } = req.body;
            
            // Process the uploaded avatar file if exists
            let finalAvatar = avatar; // Use the provided avatar string if no file uploaded
            
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64');
                finalAvatar = `data:${req.file.mimetype};base64,${base64Image}`;
            }

            if (!full_name || !username || !password || !email || !phone || !gender || !address || !salary || !brand_id) {
                return res.status(400).json('All required fields must be filled.');
            }

            const checkBrand_id = await pool.query(`SELECT id FROM brand WHERE id = $1`, [brand_id]);
            const convertToBoolean2 = checkBrand_id.rows.length > 0; // > 0 is to use true|false, not 0|1

            if (!convertToBoolean2) {
                return res.status(404).json('Incorrect brand_id.');
            }

            const userCheckQuery = `SELECT 1 FROM member_information WHERE username = $1`;
            const userCheckResult = await pool.query(userCheckQuery, [username]);

            if (userCheckResult.rowCount > 0) {
                return res.status(401).json('This username already exists.');
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const memberInfoQuery = `
                INSERT INTO member_information (full_name, username, password, role, email, phone, gender, address, dob)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `;
            const memberInfoValues = [full_name, username, hashedPassword, 'Brand Manager', email, phone, gender, address, dob];
            const memberInfoResult = await pool.query(memberInfoQuery, memberInfoValues);
            const member_information_id = memberInfoResult.rows[0].id;
            
            const staffQuery = `
                INSERT INTO rcms_staff (member_information_id, rcms_id, salary, avatar, brand_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `; 
            // Fixed duplicate brand_id in the query values
            const staffValues = [member_information_id, '739e3a4f-5818-4aa5-8160-f8f66abf8818', salary, finalAvatar, brand_id]; 

            await pool.query(staffQuery, staffValues);

            res.status(201).json({
                message: 'Staff registered successfully.'
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /register/staff
    async staffRegister(req, res, next)
    {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { full_name, username, password, email, phone, gender, address, role, salary, branch_id, position, avatar, dob } = req.body;
            
            // Process the uploaded avatar file if exists
            let finalAvatar = avatar; // Use the provided avatar string if no file uploaded
            
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64');
                finalAvatar = `data:${req.file.mimetype};base64,${base64Image}`;
            }

            if (!full_name || !username || !password || !email || !phone || !gender || !address || !role || !salary || !branch_id) {
                return res.status(400).json('All required fields must be filled.');
            }

            const checkBranch_id = await pool.query(`SELECT id FROM branch WHERE id = $1`, [branch_id]);
            const convertToBoolean2 = checkBranch_id.rows.length > 0; // > 0 is to use true|false, not 0|1

            if (!convertToBoolean2) {
                return res.status(404).json('Incorrect branch_id.');
            }

            const userCheckQuery = `SELECT 1 FROM member_information WHERE username = $1`;
            const userCheckResult = await pool.query(userCheckQuery, [username]);

            if (userCheckResult.rowCount > 0) {
                return res.status(401).json('This username already exists.');
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const memberInfoQuery = `
                INSERT INTO member_information (full_name, username, password, role, email, phone, gender, address, dob)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `;
            const memberInfoValues = [full_name, username, hashedPassword, role, email, phone, gender, address, dob];
            const memberInfoResult = await pool.query(memberInfoQuery, memberInfoValues);
            const member_information_id = memberInfoResult.rows[0].id;
            
            const staffQuery = `
                INSERT INTO staff (member_information_id, branch_id, salary, position, avatar)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `; 
            const staffValues = [member_information_id, branch_id, salary, position, finalAvatar]; 

            await pool.query(staffQuery, staffValues);

            res.status(201).json({
                message: 'Staff registered successfully.'
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /register/customer
    async customerRegister(req, res, next)
    {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { full_name, username, password, email, phone, gender, address, brand_id, dob, avatar } = req.body;
            
            // Process the uploaded avatar file if exists
            let finalAvatar = avatar; // Use the provided avatar string if no file uploaded
            
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64');
                finalAvatar = `data:${req.file.mimetype};base64,${base64Image}`;
            }

            if (!full_name || !username || !password || !email || !phone || !gender || !address || !brand_id) {
                return res.status(400).json('All required fields must be filled.');
            }

            const checkBrand_id = await pool.query(`SELECT id FROM brand WHERE id = $1`, [brand_id]);
            const convertToBoolean = checkBrand_id.rows.length > 0; // > 0 is to use true|false, not 0|1

            if (!convertToBoolean) {
                return res.status(404).json('Incorrect brand_id.');
            }

            const userCheckQuery = `SELECT 1 FROM member_information WHERE username = $1`;
            const userCheckResult = await pool.query(userCheckQuery, [username]);

            if (userCheckResult.rowCount > 0) {
                return res.status(401).json('This username already exists.');
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const memberInfoQuery = `
                INSERT INTO member_information (full_name, username, password, role, email, phone, gender, address, dob)
                VALUES ($1, $2, $3, 'Customer', $4, $5, $6, $7, $8)
                RETURNING id
            `;
            const memberInfoValues = [full_name, username, hashedPassword, email, phone, gender, address, dob];
            const memberInfoResult = await pool.query(memberInfoQuery, memberInfoValues);
            const member_information_id = memberInfoResult.rows[0].id; // Get the generated UUID

            const customerQuery = `
                INSERT INTO customer (member_information_id, brand_id, status, avatar)
                VALUES ($1, $2, 'Active', $3)
                RETURNING id
            `; 
            const customerValues = [member_information_id, brand_id, finalAvatar];

            await pool.query(customerQuery, customerValues);

            res.status(201).json({
                message: 'User registered successfully.'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RegisterController