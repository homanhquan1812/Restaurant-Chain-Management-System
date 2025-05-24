require('dotenv').config()

const { pool } = require('../../../config/db')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
        cb(null, true)
        } else {
        cb(new Error('Only image files are allowed!'), false)
        }
    }
}).single('logo_url') // 'logo' is the field name in your form

class BrandController
{
    // [GET] /brand
    async readAllBrands(req, res, next) {
        try {
            // Base query
            let brandQuery = `
                SELECT
                    LPAD(ROW_NUMBER() OVER (ORDER BY b.date_added)::TEXT, 8, '0') AS display_id,
                    b.*
                FROM brand b
            `;

            const queryParams = [];
            const conditions = [];

            // Filter: status
            if (req.query.status) {
                conditions.push(`b.status = $${queryParams.length + 1}`);
                queryParams.push(req.query.status);
            }

            // Filter: name
            if (req.query.name) {
                conditions.push(`b.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.name}%`);
            }

            // Filter: date
            if (req.query.date_added) {
                conditions.push(`DATE(b.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            // WHERE clause
            if (conditions.length > 0) {
                brandQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            brandQuery += ` ORDER BY ${req.query.sort_by || 'b.date_added'} ${req.query.sort_order || 'DESC'}`;

            // Pagination
            if (req.query.limit) {
                brandQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    brandQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const brandResult = await pool.query(brandQuery, queryParams);

            res.status(200).json({
                brand: brandResult.rows,
                total: brandResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /brand/:id
    async readABrand(req, res, next) {
        try {
            const id = req.params.id
            const brandQuery = `SELECT LPAD(ROW_NUMBER() OVER (ORDER BY date_added)::TEXT, 8, '0') AS display_id, * FROM brand WHERE id = $1;`
            const brandResult = await pool.query(brandQuery, [id])

            res.status(200).json({
                brand: brandResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /brand
    async createABrand(req, res, next) {
        // Use multer middleware via a Promise wrapper
        const handleUpload = () => {
            return new Promise((resolve, reject) => {
                upload(req, res, (err) => {
                    if (err) return reject(err)
                    resolve()
                })
            })
        }
        
        try {
            // Process the file upload
            await handleUpload()
            
            // Get the form data
            const { name, description, opening_hours, closed_hours, website_url, status } = req.body
            
            // Process the uploaded file if exists
            let logo_url = null
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64')
                logo_url = `data:${req.file.mimetype};base64,${base64Image}`
            }
            
            const query = `
                INSERT INTO brand (name, description, opening_hours, closed_hours, logo_url, website_url, status, rcms_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id;
            `
            const values = [name, description, opening_hours, closed_hours, logo_url, website_url, status, `${process.env.RCMS_ID}`]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New brand added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /brand/:id
    async updateABrand(req, res, next) {
        // Use multer middleware via a Promise wrapper
        const handleUpload = () => {
            return new Promise((resolve, reject) => {
                upload(req, res, (err) => {
                    if (err) return reject(err)
                    resolve()
                })
            })
        }
        
        try {
            // Process the file upload
            await handleUpload()
            
            // Get the form data
            const { name, description, opening_hours, closed_hours, website_url, status } = req.body
            const id = req.params.id
            
            // Process the uploaded file if exists
            let logo_url = undefined // Use undefined instead of null to work with COALESCE
            if (req.file) {
                // Convert image buffer to Base64 string
                const base64Image = req.file.buffer.toString('base64')
                logo_url = `data:${req.file.mimetype};base64,${base64Image}`
            }
            
            const query = `
            UPDATE brand SET
                name = COALESCE($1, brand.name),
                description = COALESCE($2, brand.description),
                opening_hours = COALESCE($3, brand.opening_hours),
                closed_hours = COALESCE($4, brand.closed_hours),
                logo_url = COALESCE($5, brand.logo_url),
                website_url = COALESCE($6, brand.website_url),
                status = COALESCE($7, brand.status)
            WHERE id = $8
            RETURNING *;
            `
            const values = [name, description, opening_hours, closed_hours, logo_url, website_url, status, id]
            const result = await pool.query(query, values)

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Brand not found' })
            }

            res.status(200).json({
                message: 'Brand updated successfully.',
                brand: result.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /brand/:id
    async deleteABrand(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM brand WHERE id = $1'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Brand deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Brand not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new BrandController