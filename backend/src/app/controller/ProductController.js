const { pool } = require('../../../config/db')
const multer = require('multer');

// Configure multer for image uploads
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
}).single('photo'); // 'photo' is the field name in your form

// Promise wrapper for multer upload
const handleUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

class ProductController
{
    // [GET] /product
    async getAllProducts(req, res, next) {
        try {
            let productQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY p.date_added)::TEXT, 8, '0') AS display_id,
                    p.*,
                    br.name AS brand_name
                FROM product p
                LEFT JOIN brand br ON br.id = p.brand_id
            `;

            const conditions = [];
            const queryParams = [];

            // Filters
            if (req.query.type) {
                conditions.push(`p.type ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.type}%`);
            }

            if (req.query.name) {
                conditions.push(`p.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.name}%`);
            }

            if (req.query.brand_name) {
                conditions.push(`br.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.brand_name}%`);
            }

            if (req.query.date_added) {
                conditions.push(`DATE(p.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            if (conditions.length > 0) {
                productQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            const sortBy = req.query.sort_by || 'p.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC';
            productQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                productQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    productQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const productResult = await pool.query(productQuery, queryParams);

            res.status(200).json({
                product: productResult.rows,
                total: productResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /product/:id
    async getAProduct(req, res, next) {
        try {
            const id = req.params.id
            const productQuery = `SELECT LPAD(ROW_NUMBER() OVER (ORDER BY p.date_added)::TEXT, 8, '0') AS display_id, p.*, br.name AS brand_name
                FROM product p
                LEFT JOIN brand br ON br.id = p.brand_id WHERE p.id = $1;`
            const productResult = await pool.query(productQuery, [id])

            res.status(200).json({
                product: productResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /product
    async postAProduct(req, res, next) {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { name, photo, type, description, price, brand_id, stock } = req.body;
            
            // Process the uploaded photo file if exists
            let finalPhoto = photo; // Use the provided photo string if no file uploaded
            
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64');
                finalPhoto = `data:${req.file.mimetype};base64,${base64Image}`;
            }

            if (!brand_id) {
                return res.status(404).json('Please enter brand_id.');
            }

            const checkBrand_id = await pool.query(`SELECT id FROM brand WHERE id = $1;`, [brand_id]);
            const convertToBoolean = checkBrand_id.rows.length > 0; // > 0 is to use true|false, not 0|1

            if (!convertToBoolean) {
                return res.status(404).json('Incorrect brand_id.');
            }

            const query = `
                INSERT INTO product (name, photo, type, description, price, brand_id, stock)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;
            `;
            const values = [name, finalPhoto, type, description, price, brand_id, stock];
            const result = await pool.query(query, values);

            res.status(201).json({
                message: 'New product added.',
                id: result.rows[0].id
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /product/:id
    async putAProduct(req, res, next) {
        try {
            // Process the file upload first
            await handleUpload(req, res);

            // Get form data
            const { name, photo, type, description, price, stock } = req.body;
            const id = req.params.id;
            
            // Process the uploaded photo file if exists
            let finalPhoto = photo; // Use the provided photo string if no file uploaded
            
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64');
                finalPhoto = `data:${req.file.mimetype};base64,${base64Image}`;
            }

            const query = `
                UPDATE product SET
                    name = COALESCE($1, product.name),
                    photo = COALESCE($2, product.photo),
                    type = COALESCE($3, product.type),
                    description = COALESCE($4, product.description),
                    price = COALESCE($5, product.price),
                    stock = COALESCE($6, product.stock)
                WHERE id = $7
                RETURNING product.*;
            `;
            const values = [name, finalPhoto, type, description, price, stock, id];
            const result = await pool.query(query, values);

            res.status(200).json({
                message: 'Product updated successfully.',
                product: result.rows[0]
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /product/:id
    async deleteAProduct(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM product WHERE id = $1;'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Product deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Product not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ProductController