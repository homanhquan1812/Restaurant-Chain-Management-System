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

class CustomerController
{
    // [GET] /customer
    async readAllCustomers(req, res, next) {
        try {
            let customerQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY mi.date_added)::TEXT, 8, '0') AS display_id, 
                    c.id AS customer_id,
                    c.member_information_id,
                    c.brand_id,
                    c.status,
                    c.avatar,
                    c.cart,
                    mi.id AS member_id,
                    mi.full_name,
                    mi.dob,
                    mi.username,
                    mi.role,
                    mi.email,
                    mi.phone,
                    mi.gender,
                    mi.address,
                    mi.date_added,
                    br.name AS brand_name, 
                    (SELECT COUNT(*) FROM "order" o WHERE o.customer_id = c.id) AS total_orders
                FROM customer c
                LEFT JOIN member_information mi ON c.member_information_id = mi.id
                LEFT JOIN brand br ON br.id = c.brand_id
            `;

            const queryParams = [];
            const conditions = [];

            // Filters
            if (req.query.full_name) {
                conditions.push(`mi.full_name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.full_name}%`);
            }

            if (req.query.date_added) {
                conditions.push(`DATE(mi.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            // Apply WHERE clause
            if (conditions.length > 0) {
                customerQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            const sortBy = req.query.sort_by || 'mi.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC';
            customerQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                customerQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    customerQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const customerResult = await pool.query(customerQuery, queryParams);

            res.status(200).json({
                customer: customerResult.rows,
                total: customerResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /customer/:id
    async readACustomers(req, res, next) {
        try {
            const customer_id = req.params.id
            const customerQuery = `SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY mi.date_added)::TEXT, 8, '0') AS display_id, 
                    c.id AS customer_id,
                    c.member_information_id,
                    c.brand_id,
                    c.status,
                    c.avatar,
                    c.cart,
                    mi.id AS member_id,
                    mi.full_name,
                    mi.dob,
                    mi.username,
                    mi.role,
                    mi.email,
                    mi.phone,
                    mi.gender,
                    mi.address,
                    mi.date_added,
                    br.name AS brand_name, 
                    (SELECT COUNT(*) FROM "order" o WHERE o.customer_id = c.id) AS total_orders
                FROM customer c
                LEFT JOIN member_information mi ON c.member_information_id = mi.id
                LEFT JOIN brand br ON br.id = c.brand_id WHERE c.id = $1;`
            const customerResult = await pool.query(customerQuery, [customer_id])

            res.status(200).json({
                customer: customerResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /customer/:id
    async putACustomer(req, res, next) {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { full_name, username, password, email, phone, address, status, gender, avatar, dob } = req.body;
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
                    FROM customer
                    WHERE customer.member_information_id = member_information.id
                    AND customer.id = $9
                `;
                
                let hashedPassword = null;
                if (password) {
                    hashedPassword = await bcrypt.hash(password, 10);
                }
                
                await client.query(updateMemberQuery, [full_name, username, hashedPassword, email, phone, gender, address, dob, id]);

                const updateCustomerQuery = `
                    UPDATE customer
                    SET status = COALESCE($1, customer.status),
                        avatar = COALESCE($2, customer.avatar)
                    WHERE id = $3
                `;
                
                await client.query(updateCustomerQuery, [status, finalAvatar, id]);

                const selectMemberQuery = `
                    SELECT * FROM member_information
                    INNER JOIN customer ON customer.member_information_id = member_information.id
                    WHERE customer.id = $1
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

    // [DELETE] /customer/:id
    async deleteACustomer(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM customer WHERE id = $1'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'User deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'User not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CustomerController