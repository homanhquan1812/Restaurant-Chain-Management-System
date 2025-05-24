require('dotenv').config()

const { pool } = require('../../../config/db')
const cron = require('node-cron')

class OrderController
{
    constructor() {
        cron.schedule('* * * * *', () => {
            console.log('Cron job triggered: Running combineOrders...')
            this.combineOrders()
        })
    }

    // [GET] /order
    async getAllOrders(req, res, next) {
        try {
            let orderQuery = `
                SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY o.date_added)::TEXT, 8, '0') AS display_id, 
                    o.*, 
                    c.id AS customer_id, 
                    m.full_name,
                    m.email,
                    m.phone,
                    m.address,
                    bra.address AS branch_address,
                    br.name AS brand_name
                FROM "order" o
                LEFT JOIN customer c ON o.customer_id = c.id
                LEFT JOIN member_information m ON c.member_information_id = m.id
                LEFT JOIN branch bra ON bra.id = o.branch_id
                LEFT JOIN brand br ON br.id = bra.brand_id
            `;

            const conditions = [];
            const queryParams = [];

            // Filters
            if (req.query.status) {
                conditions.push(`o.status ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.status}%`);
            }

            if (req.query.type) {
                conditions.push(`o.type ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.type}%`);
            }

            if (req.query.branch) {
                conditions.push(`bra.address ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.branch}%`);
            }

            if (req.query.full_name) {
                conditions.push(`m.full_name ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${req.query.full_name}%`);
            }

            if (req.query.date_added) {
                conditions.push(`DATE(o.date_added) = $${queryParams.length + 1}`);
                queryParams.push(req.query.date_added);
            }

            if (conditions.length > 0) {
                orderQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Sorting
            const sortBy = req.query.sort_by || 'o.date_added';
            const sortOrder = req.query.sort_order === 'ASC' ? 'ASC' : 'DESC';
            orderQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

            // Pagination
            if (req.query.limit) {
                orderQuery += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(parseInt(req.query.limit));

                if (req.query.offset) {
                    orderQuery += ` OFFSET $${queryParams.length + 1}`;
                    queryParams.push(parseInt(req.query.offset));
                }
            }

            const orderResult = await pool.query(orderQuery, queryParams);

            res.status(200).json({
                order: orderResult.rows,
                total: orderResult.rowCount
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /order/:id
    async getAOrder(req, res, next) {
        try {
            const id = req.params.id
            const orderQuery = `SELECT LPAD(ROW_NUMBER() OVER (ORDER BY o.date_added)::TEXT, 8, '0') AS display_id, 
                                    o.*, 
                                    c.id AS customer_id, 
                                    m.full_name,
                                    m.email,
                                    m.phone,
                                    m.address,
                                    bra.address AS branch_address,
                                    br.name AS brand_name
                                FROM "order" o
                                LEFT JOIN customer c ON o.customer_id = c.id
                                LEFT JOIN member_information m ON c.member_information_id = m.id
                                LEFT JOIN branch bra ON bra.id = o.branch_id
                                LEFT JOIN brand br ON br.id = bra.brand_id WHERE o.id = $1`
            const orderResult = await pool.query(orderQuery, [id])

            res.status(200).json({
                order: orderResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /order
    async createAnOrder(req, res, next)
    {
        try {        
            const { customer_id, payment_method, cart, preorder_time, other_address } = req.body
            const branch_ids = [
                '109db7f7-52a2-41fd-bfa6-9637df5cc248',
                'ff7b7703-bd86-4a78-8e87-adb745c628f9',
                'bd574b57-9ccd-4e9a-b7c5-2e35afbc513c',
                'a06edc09-9be1-4e68-b399-b2453c35edfe'
            ]
            const branch_id = branch_ids[Math.floor(Math.random() * branch_ids.length)]
            const insertOrderQuery = `
                INSERT INTO "order" (customer_id, branch_id, status, payment_method, cart, preorder_time, other_address)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `
            const orderResult = await pool.query(insertOrderQuery, [
                customer_id, 
                branch_id, 'Processing', payment_method, cart, preorder_time, other_address])
            const newOrder = orderResult.rows[0]
            const userQuery = `SELECT * FROM member_information INNER JOIN customer ON customer.member_information_id = member_information.id WHERE customer.id = $1;`
            const userResult = await pool.query(userQuery, [customer_id])

            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }

            const userMatch = userResult.rows[0]
            const resetCartQuery = `
                UPDATE customer
                SET cart = '{"total_price": 0, "items": []}'
                WHERE id = $1
            `
            await pool.query(resetCartQuery, [userMatch.id])

            res.status(201).json({
                message: "Order created successfully and user's cart has been reset.",
                order: newOrder
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /order/:id
    async putAOrder(req, res, next) {
        try {
            const { branch_id, status, type, preorder_time, payment_method, cart, other_address } = req.body
            const id = req.params.id
            const query = `
                UPDATE "order" SET
                    branch_id = COALESCE($1, "order".branch_id),
                    status = COALESCE($2, "order".status),
                    type = COALESCE($3, "order".type),
                    preorder_time = COALESCE($4, "order".preorder_time),
                    payment_method = COALESCE($5, "order".payment_method),
                    cart = COALESCE($6, "order".cart),
                    other_address = COALESCE($7, "order".other_address)
                WHERE id = $8
                RETURNING "order".*;
            `
            const values = [branch_id, status, type, preorder_time, payment_method, cart, other_address, id]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'New order adjusted.',
                id: result.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /order/:id
    async deleteAOrder(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM "order" WHERE id = $1;'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'Order deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'Order not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }

    // [POST] /order/combine_orders
    async combineOrders() {
        try {
            const orderQuery = `SELECT * FROM "order" ORDER BY customer_id, date_added ASC;`
            const orderResult = await pool.query(orderQuery)
            let orders = orderResult.rows
    
            // ========== COMBINE ORDERS LOGIC ==========
            console.log("Checking for orders to combine...")
            
            // Group orders by customer_id
            const customerOrders = {}
            orders.forEach(order => {
                if (!customerOrders[order.customer_id]) {
                    customerOrders[order.customer_id] = []
                }
                customerOrders[order.customer_id].push(order)
            })
            
            // Track orders to be removed after combining and orders that were modified
            const ordersToRemove = new Set()
            const combinedOrders = new Map() // Track which orders were combined (key=earlierOrderId, value=updatedOrder)
            
            // Process each customer's orders to find and combine those within 5 minutes
            for (const customerId in customerOrders) {
                const customerOrdersList = customerOrders[customerId]
                
                // Sort orders by date_added 
                customerOrdersList.sort((a, b) => new Date(a.date_added) - new Date(b.date_added))
                
                let i = 0
                while (i < customerOrdersList.length - 1) {
                    const currentOrder = customerOrdersList[i]
                    const nextOrder = customerOrdersList[i + 1]
                    
                    // Skip orders already marked for removal
                    if (ordersToRemove.has(currentOrder.id)) {
                        i++
                        continue
                    }
                    
                    const timeDiff = new Date(nextOrder.date_added) - new Date(currentOrder.date_added)
                    const minutesDiff = timeDiff / (1000 * 60)
                    
                    if (minutesDiff <= 5) {
                        console.log(`Found orders to combine: ${currentOrder.id} and ${nextOrder.id} (time diff: ${minutesDiff.toFixed(2)} minutes)`)
                        
                        // Parse cart data if needed
                        const earlierCart = typeof currentOrder.cart === 'string' 
                            ? JSON.parse(currentOrder.cart) 
                            : currentOrder.cart
                        
                        const laterCart = typeof nextOrder.cart === 'string' 
                            ? JSON.parse(nextOrder.cart) 
                            : nextOrder.cart
                        
                        // Combine cart items
                        const combinedItems = [...earlierCart.items]
                        
                        laterCart.items.forEach(laterItem => {
                            const existingItemIndex = combinedItems.findIndex(item => item.id === laterItem.id)
                            
                            if (existingItemIndex !== -1) {
                                // If item already exists, update quantity and total price
                                combinedItems[existingItemIndex].quantity += laterItem.quantity
                                combinedItems[existingItemIndex].total_price += laterItem.total_price
                            } else {
                                // Otherwise add new item
                                combinedItems.push(laterItem)
                            }
                        })
                        
                        // Calculate new total price
                        const newTotalPrice = combinedItems.reduce((sum, item) => sum + item.total_price, 0)
                        
                        // Update the cart in the earlier order
                        currentOrder.cart = {
                            items: combinedItems,
                            total_price: newTotalPrice
                        }
                        
                        // Store the updated order for later database updates
                        combinedOrders.set(currentOrder.id, currentOrder)
                        
                        // Mark the later order for removal
                        ordersToRemove.add(nextOrder.id)
                        
                        // Skip the next order since we've combined it
                        i++
                    }
                    i++
                }
            }
            
            // Filter out orders marked for removal
            orders = orders.filter(order => !ordersToRemove.has(order.id))
            
            console.log(`Combined ${ordersToRemove.size} orders in total.`)
    
            // ========== UPDATE SOURCE DATABASE (BRAND DATABASE) ==========
            console.log("Updating source database with combined orders...")
            
            // Update the combined orders in the source database
            for (const [orderId, updatedOrder] of combinedOrders.entries()) {
                const updateQuery = `
                    UPDATE "order"
                    SET cart = $1::jsonb
                    WHERE id = $2
                `;
                
                await pool.query(updateQuery, [
                    JSON.stringify(updatedOrder.cart),
                    orderId
                ]);
                
                console.log(`Updated order ${orderId} in source database.`);
            }
            
            // Delete the combined orders from the source database
            if (ordersToRemove.size > 0) {
                const deleteOrdersArray = Array.from(ordersToRemove);
                const deleteQuery = `
                    DELETE FROM "order"
                    WHERE id = ANY($1)
                `;
                
                await pool.query(deleteQuery, [deleteOrdersArray]);
                console.log(`Deleted ${ordersToRemove.size} combined orders from source database.`);
            }
    
            // ========== UPDATE RCMS DATABASE ==========
            console.log("Updating RCMS database with combined orders...")
            
            // Now continue with the regular import process using the filtered/combined orders
            const existingOrdersQuery = `SELECT id FROM "order"`;
            const existingOrdersResult = await pool.query(existingOrdersQuery);
            const existingOrderIds = new Set(existingOrdersResult.rows.map(row => row.id));
    
            // Track processed IDs to detect deleted records later
            const processedOrderIds = new Set();
    
            for (let order of orders) {
                processedOrderIds.add(order.id); // Mark this ID as processed
    
                // Insert or update order data
                const orderQuery = `
                    INSERT INTO "order" (id, customer_id, branch_id, status, payment_method, cart, date_added, preorder_time, type)
                    VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9)
                    ON CONFLICT (id) DO UPDATE 
                    SET customer_id = EXCLUDED.customer_id,
                        branch_id = EXCLUDED.branch_id,
                        status = EXCLUDED.status,
                        payment_method = EXCLUDED.payment_method,
                        cart = EXCLUDED.cart,
                        date_added = EXCLUDED.date_added,
                        preorder_time = EXCLUDED.preorder_time,
                        type = EXCLUDED.type;
                `;

                const orderValues = [
                    order.id,
                    order.customer_id,
                    order.branch_id,
                    order.status,
                    order.payment_method,
                    JSON.stringify(order.cart),
                    order.date_added,
                    order.preorder_time,
                    order.type
                ];
    
                await pool.query(orderQuery, orderValues);
            }
    
            // Find records that need to be deleted (exist in DB but not in new JSON)
            const ordersToDelete = [...existingOrderIds].filter(id => !processedOrderIds.has(id));
    
            if (ordersToDelete.length > 0) {
                console.log(`Deleting orders: ${ordersToDelete.join(", ")}`);
    
                const deleteQuery = `DELETE FROM "order" WHERE id = ANY($1)`;
                await pool.query(deleteQuery, [ordersToDelete]);
            }
    
            console.log('Orders combined and synchronized successfully in both databases')
        } catch (error) {
            console.error(error)
        }
    }

    // [PUT] /order/late/checking
    async checkLate(req, res, next) {
        try {
            const updateLateOrdersQuery = `
                UPDATE "order"
                SET late = true
                WHERE late = false 
                AND status != 'Completed' 
                AND status != 'Cancelled'
                AND date_added <= NOW() - INTERVAL '45 minutes'
                RETURNING id, date_added, status
            `;
            
            const result = await pool.query(updateLateOrdersQuery);
            
            const updatedOrders = result.rows;
            
            return res.status(200).json({
                message: `${updatedOrders.length} orders marked as late`,
                data: updatedOrders
            });
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /order/late/checked/:id
    async checkedLate(req, res, next) {
        try {
            const id = req.params.id
            const updateOrderQuery = `
                UPDATE "order"
                SET resolved = true
                WHERE id = $1
                RETURNING id, customer_id, status, resolved, late
            `;
            
            const result = await pool.query(updateOrderQuery, [id]);
            
            return res.status(200).json({
                success: true,
                message: "Order marked as resolved",
                data: result.rows[0]
            });
        } catch (error) {
            next(error)
        }
    }

    /*
    // [POST] /order
    async createAnOrder(req, res, next)
    {
        try {        
            const { customer_id, brand_id, branch_id, payment_method, cart } = req.body
            const customerQuery = 'SELECT * FROM member_information INNER JOIN customer ON customer.member_information_id = member_information.id WHERE customer.id = $1;'
            const customerResult = await pool.query(customerQuery, [customer_id])

            // Check if the customer has placed an order within the last 5 minutes
            const recentOrderQuery = `
                SELECT * FROM "order" 
                WHERE customer_id = $1 
                AND date_added > (CURRENT_TIMESTAMP - INTERVAL '5 minutes')
                ORDER BY date_added DESC 
                LIMIT 1
            `
            const recentOrderResult = await pool.query(recentOrderQuery, [customer_id])

            // Make sure cart is parsed properly
            const newCart = typeof cart === 'string' ? JSON.parse(cart) : cart

            if (recentOrderResult.rows.length > 0) {
                // Recent order exists, combine carts
                const existingOrder = recentOrderResult.rows[0]
                // Make sure existingCart is properly parsed
                const existingCart = typeof existingOrder.cart === 'string' ? 
                                    JSON.parse(existingOrder.cart) : 
                                    existingOrder.cart
                
                // Combine items
                const combinedItems = [...existingCart.items]
                
                // Add new items or update quantities
                for (const newItem of newCart.items) {
                    const existingItemIndex = combinedItems.findIndex(item => item.id === newItem.id)
                    
                    if (existingItemIndex >= 0) {
                        // Item exists, update quantity and total_price
                        combinedItems[existingItemIndex].quantity += newItem.quantity
                        combinedItems[existingItemIndex].total_price += newItem.total_price
                    } else {
                        // New item, add to cart
                        combinedItems.push(newItem)
                    }
                }
                
                // Calculate new total price
                const newTotalPrice = combinedItems.reduce((sum, item) => sum + item.total_price, 0)
                
                // Create updated cart object
                const updatedCart = {
                    items: combinedItems,
                    total_price: newTotalPrice
                }
                
                // Update the existing order
                const updateOrderQuery = `
                    UPDATE "order"
                    SET cart = $1,
                        date_added = CURRENT_TIMESTAMP
                    WHERE id = $2
                    RETURNING *
                `
                
                const updatedOrderResult = await pool.query(updateOrderQuery, [updatedCart, existingOrder.id])
                const updatedOrder = updatedOrderResult.rows[0]
                
                // Reset the customer's cart
                const resetCartQuery = `
                    UPDATE customer
                    SET cart = '{"total_price": 0, "items": []}'
                    WHERE id = $1
                `
                await pool.query(resetCartQuery, [customer_id])
                
                return res.status(200).json({
                    message: "Order updated successfully by combining with recent order. Customer's cart has been reset.",
                    order: updatedOrder
                })
            } else {
                // No recent order, create new order as before
                const insertOrderQuery = `
                    INSERT INTO "order" (customer_id, full_name, email, phone, gender, address, brand_id, branch_id, status, payment_method, cart)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    RETURNING *
                `
                const orderResult = await pool.query(insertOrderQuery, [
                    customer_id, 
                    customerResult.rows[0].full_name, 
                    customerResult.rows[0].email, 
                    customerResult.rows[0].phone, 
                    customerResult.rows[0].gender, 
                    customerResult.rows[0].address, 
                    brand_id, branch_id, 'Processing', payment_method, newCart])
                const newOrder = orderResult.rows[0]
                
                // Reset the customer's cart
                const resetCartQuery = `
                    UPDATE customer
                    SET cart = '{"total_price": 0, "items": []}'
                    WHERE id = $1
                `
                await pool.query(resetCartQuery, [customer_id])
                
                return res.status(201).json({
                    message: "Order created successfully and user's cart has been reset.",
                    order: newOrder
                })
            }
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /employee/order/:id
    async orderDelivered(req, res, next)
    {
        try {
            const id = req.params.id
            const checkOrderQuery = 'SELECT * FROM "order" WHERE id = $1'
            const orderResult = await pool.query(checkOrderQuery, [id])

            if (orderResult.rows.length === 0) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }

            const updateOrderQuery = `
                UPDATE "order"
                SET status = 'Delivered'
                WHERE id = $1
                RETURNING *
            `;
            const updatedOrderResult = await pool.query(updateOrderQuery, [id])
            const updatedOrder = updatedOrderResult.rows[0]

            res.status(200).json({
                message: 'Order delivered.',
                order: updatedOrder
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /manager/order/:id
    async orderDeclined(req, res, next)
    {
        try {
            const id = req.params.id
            const checkOrderQuery = 'SELECT * FROM "order" WHERE id = $1'
            const orderResult = await pool.query(checkOrderQuery, [id])

            if (orderResult.rows.length === 0) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }

            const updateOrderQuery = `
                UPDATE "order"
                SET status = 'Declined'
                WHERE id = $1
                RETURNING *
            `;
            const updatedOrderResult = await pool.query(updateOrderQuery, [id])
            const updatedOrder = updatedOrderResult.rows[0]

            res.status(200).json({
                message: 'Order declined.',
                order: updatedOrder
            })
        } catch (error) {
            next(error)
        }
    }
    */
}

module.exports = new OrderController