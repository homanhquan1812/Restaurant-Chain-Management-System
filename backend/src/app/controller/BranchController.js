require('dotenv').config()

const { pool } = require('../../../config/db')

class BranchController
{
    // [GET] /branch
    async readAllBranches(req, res, next) {
        try {
            // Start with the base query
            let branchQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY br.date_added)::TEXT, 8, '0') AS display_id, 
                    br.*, 
                    b.name AS brand_name, 
                    COUNT(s.id) AS total_staffs,
                    COUNT(*) FILTER (WHERE mi.role = 'Branch Employee') AS total_employees,
                    COUNT(*) FILTER (WHERE mi.role = 'Branch Manager') AS total_managers
                FROM branch br
                LEFT JOIN brand b ON b.id = br.brand_id
                LEFT JOIN staff s ON s.branch_id = br.id
                LEFT JOIN member_information mi ON s.member_information_id = mi.id
            `;

            const queryParams = [];
            const conditions = [];

            // Filters
            if (req.query.status) {
                conditions.push(`br.status = $${queryParams.length + 1}`);
                queryParams.push(req.query.status);
            }

            if (req.query.brand_name) {
                conditions.push(`b.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.brand_name}%`);
            }

            if (req.query.address) {
                conditions.push(`br.address ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.address}%`);
            }

            if (req.query.phone) {
                conditions.push(`br.phone ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.phone}%`);
            }

            if (req.query.date_from && req.query.date_to) {
                conditions.push(`br.date_added BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`);
                queryParams.push(req.query.date_from);
                queryParams.push(req.query.date_to);
            } else if (req.query.date_from) {
                conditions.push(`br.date_added >= $${queryParams.length + 1}`);
                queryParams.push(req.query.date_from);
            } else if (req.query.date_to) {
                conditions.push(`br.date_added <= $${queryParams.length + 1}`);
                queryParams.push(req.query.date_to);
            }

            // Add WHERE clause if needed
            if (conditions.length > 0) {
                branchQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Group by
            branchQuery += `
                GROUP BY br.id, b.name, br.date_added
            `;

            // Sorting
            const sortBy = req.query.sort_by || 'br.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC'; // Default to DESC
            branchQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                branchQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    branchQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const branchResult = await pool.query(branchQuery, queryParams);

            res.status(200).json({
                branch: branchResult.rows,
                total: branchResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /branch/:id
    async readABranch(req, res, next) {
        try {
            const id = req.params.id
            const branchQuery = `SELECT LPAD(ROW_NUMBER() OVER (ORDER BY br.date_added)::TEXT, 8, '0') AS display_id, br.*, b.name AS brand_name, COUNT(s.id) AS total_staffs,
                COUNT(*) FILTER (WHERE mi.role = 'Branch Employee') AS total_employees,
                COUNT(*) FILTER (WHERE mi.role = 'Branch Manager') AS total_managers
                FROM branch br
                LEFT JOIN brand b ON b.id = br.brand_id
                LEFT JOIN staff s ON s.branch_id = br.id
                LEFT JOIN member_information mi ON s.member_information_id = mi.id
                WHERE br.id = $1
                GROUP BY 
                    br.id, b.name, b.date_added;
                `
            const branchResult = await pool.query(branchQuery, [id])

            res.status(200).json({
                branch: branchResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /branch
    async createABranch(req, res, next) {
        try {
            const { brand_id, address, phone, status } = req.body

            const query = `
                INSERT INTO branch (brand_id, address, phone, status)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            `
            const values = [brand_id, address, phone, status]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New branch added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /branch/:id
    async updateABranch(req, res, next) {
        try {
            const { address, phone, status } = req.body
            const id = req.params.id
            const query = `
                UPDATE branch SET
                    address = COALESCE($1, branch.address),
                    phone = COALESCE($2, branch.phone),
                    status = COALESCE($3, branch.status)
                WHERE id = $4
                RETURNING branch.*;
            `
            const values = [address, phone, status, id]
            const result = await pool.query(query, values)

            res.status(200).json({
                message: 'Branch adjusted.',
                id: result.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /branch/:id
    async deleteABranch(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM branch WHERE id = $1'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Branch deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Branch not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new BranchController