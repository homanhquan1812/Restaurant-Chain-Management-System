const { pool } = require('../../../config/db')

class ReservationController
{
    // [GET] /reservation
    async getAllReservations(req, res, next) {
        try {
            let reservationQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY r.date_added)::TEXT, 8, '0') AS display_id, 
                    r.*, 
                    br.name AS brand_name, 
                    bra.address AS branch_address 
                FROM reservation r 
                LEFT JOIN branch bra ON bra.id = r.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
            `;

            const conditions = [];
            const queryParams = [];

            // Filters
            if (req.query.status) {
                conditions.push(`r.status ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.status}%`);
            }

            if (req.query.place) {
                conditions.push(`r.place ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.place}%`);
            }

            if (req.query.brand_name) {
                conditions.push(`br.name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.brand_name}%`);
            }

            if (req.query.branch_address) {
                conditions.push(`bra.address ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.branch_address}%`);
            }

            if (req.query.full_name) {
                conditions.push(`r.full_name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.full_name}%`);
            }

            if (req.query.date_added) {
                conditions.push(`DATE(r.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added); // must be "YYYY-MM-DD"
            }

            if (req.query.reservation_time) {
                conditions.push(`DATE(r.reservation_time) = $${queryParams.length + 1}`);
                queryParams.push(req.query.reservation_time); // must be "YYYY-MM-DD"
            }

            if (conditions.length > 0) {
                reservationQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            const sortBy = req.query.sort_by || 'r.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC';
            reservationQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                reservationQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    reservationQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const reservationResult = await pool.query(reservationQuery, queryParams);

            res.status(200).json({
                reservation: reservationResult.rows,
                total: reservationResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /reservation/:id
    async getAReservation(req, res, next) {
        try {
            const id = req.params.id
            const reservationQuery = `SELECT r.*, br.name AS brand_name, bra.address AS branch_address FROM reservation r LEFT JOIN branch bra ON bra.id = r.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id WHERE r.id = $1;`
            const reservationResult = await pool.query(reservationQuery, [id])

            res.status(200).json({
                reservation: reservationResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /reservation
    async postAReservation(req, res, next) {
        try {
            const { full_name, phone, reservation_time, date_added, branch_id, number_of_customer, place } = req.body
            const query = `
                INSERT INTO reservation (full_name, phone, reservation_time, date_added, number_of_customer, status, place, branch_id)
                VALUES ($1, $2, $3, $4, $5, 'Pending', $6, $7)
                RETURNING id;
            `
            const values = [full_name, phone, reservation_time, date_added, number_of_customer, place, branch_id]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New reservation added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /reservation/:id
    async putAReservation(req, res, next) {
        try {
            const { full_name, phone, reservation_time, date_added, status, branch_id, number_of_customer, place } = req.body
            const id = req.params.id
            const query = `
                UPDATE reservation SET
                    full_name = COALESCE($1, reservation.full_name),
                    phone = COALESCE($2, reservation.phone),
                    reservation_time = COALESCE($3, reservation.reservation_time),
                    date_added = COALESCE($4, reservation.date_added),
                    status = COALESCE($5, reservation.status),
                    branch_id = COALESCE($6, reservation.branch_id),
                    number_of_customer = COALESCE($7, reservation.number_of_customer),
                    place = COALESCE($8, reservation.place)
                WHERE id = $9
                RETURNING reservation.*;
            `
            const values = [full_name, phone, reservation_time, date_added, status, branch_id, number_of_customer, place, id]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'Reservation adjusted.',
                id: result.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /reservation
    async deleteAReservation(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM reservation WHERE id = $1;'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'reservation deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'reservation not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /reservation
    async deleteAllReservations(req, res, next) {
        try {
            const deleteQuery = 'DELETE FROM reservation;'
            const result = await pool.query(deleteQuery)

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'All reservations deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'reservation not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ReservationController