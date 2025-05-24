const { pool } = require('../../../config/db')

class VoucherController
{
    // [GET] /voucher
    async getAllVouchers(req, res, next) {
        try {
            let voucherQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY v.date_added)::TEXT, 8, '0') AS display_id,
                    v.*, 
                    br.name AS brand_name 
                FROM voucher v
                LEFT JOIN brand br ON br.id = v.brand_id
            `;

            const conditions = [];
            const queryParams = [];

            // Filters
            if (req.query.status) {
                conditions.push(`v.status ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.status}%`);
            }

            if (req.query.title) {
                conditions.push(`v.title ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.title}%`);
            }

            if (req.query.brand_name) {
                conditions.push(`br.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.brand_name}%`);
            }

            // Date filters
            if (req.query.date_added) {
                conditions.push(`v.date_added >= $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            // Apply conditions
            if (conditions.length > 0) {
                voucherQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            const sortBy = req.query.sort_by || 'v.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC';
            voucherQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                voucherQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    voucherQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const voucherResult = await pool.query(voucherQuery, queryParams);

            res.status(200).json({
                voucher: voucherResult.rows,
                total: voucherResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /voucher/:id
    async getAVoucher(req, res, next) {
        try {
            const id = req.params.id
            const voucherQuery = `SELECT LPAD(ROW_NUMBER() OVER (ORDER BY v.date_added)::TEXT, 8, '0') AS display_id, v.*, br.name 
            FROM voucher v
            LEFT JOIN brand br ON br.id = v.brand_id WHERE v.id = $1;`
            const voucherResult = await pool.query(voucherQuery, [id])

            res.status(200).json({
                voucher: voucherResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /voucher
    async postAVoucher(req, res, next) {
        try {
            const { title, discount_percent, code, status, start_date, end_date, type, discount_type, description, brand_id } = req.body

            if (!brand_id) {
                return res.status(404).json('Please enter brand_id.')
            }

            const checkBrand_id = await pool.query(`SELECT id FROM brand WHERE id = $1;`, [brand_id])
            const convertToBoolean = checkBrand_id.rows.length > 0 // > 0 is to use true|false, not 0|1

            if (!convertToBoolean) {
                return res.status(404).json('Incorrect brand_id.')
            }

            const query = `
                INSERT INTO voucher (title, discount_percent, code, status, start_date, end_date, type, discount_type, description, brand_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id;
            `
            const values = [title, discount_percent, code, status, start_date, end_date, type, discount_type, description, brand_id]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New voucher added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /voucher/:id
    async putAVoucher(req, res, next) {
        try {
            const { title, discount_percent, code, status, start_date, end_date, type, discount_type, description } = req.body
            const id = req.params.id
            const query = `
                UPDATE voucher SET
                    title = COALESCE($1, voucher.title),
                    discount_percent = COALESCE($2, voucher.discount_percent),
                    code = COALESCE($3, voucher.code),
                    status = COALESCE($4, voucher.status),
                    start_date = COALESCE($5, voucher.start_date),
                    end_date = COALESCE($6, voucher.end_date),
                    type = COALESCE($7, voucher.type),
                    discount_type = COALESCE($8, voucher.discount_type),
                    description = COALESCE($9, voucher.description)
                WHERE id = $10
                RETURNING voucher.*;
            `
            const values = [title, discount_percent, code, status, start_date, end_date, type, discount_type, description, id]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'voucher adjusted.',
                id: result.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /voucher/:id
    async deleteAVoucher(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM voucher WHERE id = $1;'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Voucher deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Voucher not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new VoucherController