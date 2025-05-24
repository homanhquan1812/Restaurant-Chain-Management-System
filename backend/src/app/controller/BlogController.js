const { pool } = require('../../../config/db')

class BlogController
{
    async getAllBlogs(req, res, next) {
        try {
            // Start with the base query
            let blogQuery = `
                SELECT LPAD(ROW_NUMBER() OVER (ORDER BY b.date_added)::TEXT, 8, '0') AS display_id, b.*, bra.address AS branch_address, br.name AS brand_name, mi.full_name
                FROM blog b
                LEFT JOIN staff s ON s.id = b.staff_id
                LEFT JOIN branch bra ON bra.id = s.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
                LEFT JOIN member_information mi ON mi.id = s.member_information_id
            `;
            
            // Initialize parameters array for prepared statement
            const queryParams = [];
            // Initialize WHERE clause conditions array
            const conditions = [];
            
            // Handle possible filter parameters
            if (req.query.status) {
                conditions.push(`b.status = $${queryParams.length + 1}`);
                queryParams.push(req.query.status);
            }
            
            if (req.query.brand_name) {
                conditions.push(`br.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.brand_name}%`);
            }
            
            if (req.query.staff_name) {
                conditions.push(`mi.full_name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.staff_name}%`);
            }
            
            if (req.query.title) {
                conditions.push(`b.title ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.title}%`);
            }
            
            if (req.query.branch_address) {
                conditions.push(`bra.address ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.branch_address}%`);
            }
            
            if (req.query.date_added) {
                conditions.push(`DATE(b.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            // Add WHERE clause if there are conditions
            if (conditions.length > 0) {
                blogQuery += ` WHERE ${conditions.join(' AND ')}`;
            }
            
            // Add ORDER BY clause
            blogQuery += ` ORDER BY ${req.query.sort_by || 'b.date_added'} ${req.query.sort_order || 'DESC'}`;
            
            // Add pagination
            if (req.query.limit) {
                blogQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));
                
                if (req.query.offset) {
                    blogQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }
            
            // Execute the query
            const blogResult = await pool.query(blogQuery, queryParams);
            
            res.status(200).json({
                blog: blogResult.rows,
                total: blogResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /blog/:id
    async getABlog(req, res, next) {
        try {
            const id = req.params.id
            const blogQuery = `
                SELECT LPAD(ROW_NUMBER() OVER (ORDER BY b.date_added)::TEXT, 8, '0') AS display_id, b.*, bra.address AS branch_address, br.name AS brand_name, mi.full_name
                FROM blog b
                LEFT JOIN staff s ON s.id = b.staff_id
                LEFT JOIN branch bra ON bra.id = s.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
                LEFT JOIN member_information mi ON mi.id = s.member_information_id
                WHERE b.id = $1;
                `
            const blogResult = await pool.query(blogQuery, [id])

            res.status(200).json({
                blog: blogResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /blog
    async postABlog(req, res, next) {
        try {
            const { title, photo, content, staff_id, status } = req.body
            const query = `
                INSERT INTO blog (title, photo, content, staff_id, status)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `
            const values = [title, photo, content, staff_id, status]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New blog added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /blog/:id
    async putABlog(req, res, next) {
        try {
            const { title, photo, content, status } = req.body
            const id = req.params.id
            const query = `
                UPDATE blog SET
                    title = COALESCE($1, blog.title),
                    photo = COALESCE($2, blog.photo),
                    content = COALESCE($3, blog.content),
                    status = COALESCE($4, blog.status)
                WHERE id = $5
                RETURNING blog.*;
            `
            const values = [title, photo, content, status, id]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'Blog adjusted.',
                id: result.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /blog/:id
    async deleteABlog(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM blog WHERE id = $1;'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Blog deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Blog not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new BlogController