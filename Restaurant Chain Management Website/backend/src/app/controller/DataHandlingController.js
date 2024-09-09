const { pool } = require('../../../config/db')

class DataHandlingController {
    // [GET] /datahandling/{API_KEY}
    async readAllDataLinks(req, res, next) {
        try {
            const dataQuery = `
                SELECT r.*, 
                rwd.website_url, rwd.logo_url, rsd.staff_url, rsd.product_url, rsd.revenue_url, rsd.feedback_url
                FROM restaurant r
                LEFT JOIN restaurant_website_data rwd ON r.id = rwd.website_data_id
                LEFT JOIN restaurant_specific_data rsd ON rwd.id = rsd.specific_data_id;
            `
            const dataResult = await pool.query(dataQuery)

            res.status(200).json({
                restaurant_data: dataResult.rows
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /datahandling/{API_KEY}
    async createADataLink(req, res, next) {
        try {
            const { restaurant_name, website_url, logo_url, staff_url, product_url, revenue_url, feedback_url } = req.body

            if (!restaurant_name || !website_url || !logo_url || !staff_url || !product_url || !revenue_url) {
                return res.status(400).json({ 
                    error: 'Insufficient information required.' 
                })
            }

            const insertRestaurantQuery = `
                INSERT INTO restaurant (restaurant_name)
                VALUES ($1)
                RETURNING id;
            `
            const restaurantValues = [restaurant_name]
            const restaurantResult = await pool.query(insertRestaurantQuery, restaurantValues)
            const restaurantId = restaurantResult.rows[0].id

            const insertWebsiteDataQuery = `
                INSERT INTO restaurant_website_data (website_url, logo_url, website_data_id)
                VALUES ($1, $2, $3)
                RETURNING id;
            `
            const websiteDataValues = [website_url, logo_url, restaurantId]
            const websiteDataResult = await pool.query(insertWebsiteDataQuery, websiteDataValues)
            const websiteDataId = websiteDataResult.rows[0].id

            const insertSpecificDataQuery = `
                INSERT INTO restaurant_specific_data (staff_url, product_url, revenue_url, feedback_url, specific_data_id)
                VALUES ($1, $2, $3, $4, $5);
            `
            const specificDataValues = [staff_url, product_url, revenue_url, feedback_url, websiteDataId]

            await pool.query(insertSpecificDataQuery, specificDataValues)

            res.status(201).json('Restaurant added successfully.')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new DataHandlingController