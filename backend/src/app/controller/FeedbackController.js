const { pool } = require('../../../config/db')

class FeedbackController
{
    // [GET] /feedback
    async readAllFeedbacks(req, res, next) {
        try {
            let feedbackQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY f.date_added)::TEXT, 8, '0') AS display_id,
                    f.*,
                    bra.address AS branch_address,
                    br.name AS brand_name,
                    mi_s.full_name AS staff_name,
                    mi_c.full_name AS customer_name,
                    mi_c.phone AS customer_phone
                FROM feedback f
                LEFT JOIN member_information mi_s ON mi_s.id = f.solved_by
                LEFT JOIN customer c ON c.id = f.customer_id
                LEFT JOIN member_information mi_c ON mi_c.id = c.member_information_id
                LEFT JOIN staff s ON s.member_information_id = mi_s.id
                LEFT JOIN branch bra ON bra.id = s.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
            `;

            const queryParams = [];
            const conditions = [];

            // Filters
            if (req.query.status) {
                conditions.push(`f.status = $${queryParams.length + 1}`);
                queryParams.push(req.query.status);
            }

            if (req.query.type) {
                conditions.push(`f.type ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.type}%`);
            }

            if (req.query.customer_name) {
                conditions.push(`mi_c.full_name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.customer_name}%`);
            }

            if (req.query.branch_address) {
                conditions.push(`bra.address ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.branch_address}%`);
            }

            if (req.query.brand_name) {
                conditions.push(`br.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.brand_name}%`);
            }

            if (req.query.staff_name) {
                conditions.push(`mi_s.full_name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.staff_name}%`);
            }

            if (req.query.date_added) {
                conditions.push(`DATE(f.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            // Apply WHERE clause
            if (conditions.length > 0) {
                feedbackQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            const sortBy = req.query.sort_by || 'f.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC';
            feedbackQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                feedbackQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    feedbackQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const feedbackResult = await pool.query(feedbackQuery, queryParams);

            res.status(200).json({
                feedback: feedbackResult.rows,
                total: feedbackResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /feedback/:id
    async readAFeedback(req, res, next) {
        try {
            const id = req.params.id
            const feedbackQuery = `
                SELECT LPAD(ROW_NUMBER() OVER (ORDER BY f.date_added)::TEXT, 8, '0') AS display_id, f.*, bra.address AS branch_address, br.name AS brand_name, mi_s.full_name AS staff_name, mi_c.full_name AS customer_name, mi_c.phone AS customer_phone
                FROM feedback f
                LEFT JOIN member_information mi_s ON mi_s.id = f.solved_by
                LEFT JOIN customer c ON c.id = f.customer_id
                LEFT JOIN member_information mi_c ON mi_c.id = c.member_information_id
                LEFT JOIN staff s ON s.member_information_id = mi_s.id           
                LEFT JOIN branch bra ON bra.id = s.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
                WHERE f.id = $1
            `
            const feedbackResult = await pool.query(feedbackQuery, [id])

            res.status(200).json({
                feedback: feedbackResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /feedback
    async createAFeedback(req, res, next) {
        try {
            const { customer_id, branch_id, type, content } = req.body
            const query = `
                INSERT INTO feedback (customer_id, branch_id, type, content)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            `
            const values = [customer_id, branch_id, type, content]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New feedback added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /feedback/:id
    async updateAFeedback(req, res, next) {
        try {
            const id = req.params.id
            const { staff_id } = req.body
            const feedbackQuery = `SELECT * FROM feedback WHERE id = $1`
            const feedbackResult = await pool.query(feedbackQuery, [id])

            if (feedbackResult.rows.length === 0) {
                return res.status(404).json({ 
                    message: 'Feedback not found' 
                })
            }

            const updateQuery = `
                UPDATE feedback 
                SET solved_by = $1, 
                    updated_at = CURRENT_TIMESTAMP,
                    status = 'Resolved'
                WHERE id = $2
                RETURNING *
            `
            const updateResult = await pool.query(updateQuery, [staff_id, id])
            
            res.status(200).json({
                message: 'Feedback resolved successfully',
                data: updateResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /feedback/:id
    async deleteAFeedback(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM feedback WHERE id = $1;'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Feedback deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Feedback not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new FeedbackController