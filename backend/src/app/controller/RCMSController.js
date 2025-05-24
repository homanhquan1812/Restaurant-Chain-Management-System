require('dotenv').config()

const { pool } = require('../../../config/db')
const bcrypt = require('bcrypt')
const { Pool } = require('pg')
// const cron = require('node-cron')
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

class RCMSController 
{
    // [GET] /rcms/rcms_staff
    async readAllRcmsStaffs(req, res, next) {
        try {
            const staffQuery = `
            SELECT 
            LPAD(ROW_NUMBER() OVER (ORDER BY mi.date_added)::TEXT, 8, '0') AS display_id, 
            rs.id,
            rs.member_information_id,
            rs.brand_id,
            rs.avatar,
            rs.salary,
            mi.full_name,
            mi.username,
            mi.role,
            mi.dob,
            mi.email,
            mi.phone,
            mi.gender,
            mi.address,
            mi.date_added,
            br.name AS brand_name, 
            br.logo_url
        FROM rcms_staff rs
        JOIN member_information mi ON rs.member_information_id = mi.id
        LEFT JOIN brand br ON br.id = rs.brand_id
        WHERE mi.role = 'Brand Manager'
            `
            const staffResult = await pool.query(staffQuery)

            res.status(200).json({
                staff: staffResult.rows
            })
        } catch (error) {
            next(error)
        }
    }

    // [GET] /rcms/rcms_staff/:id
    async readARcmsStaff(req, res, next) {
        try {
            const id = req.params.id
            const staffQuery = `SELECT 
                LPAD(ROW_NUMBER() OVER (ORDER BY mi.date_added)::TEXT, 8, '0') AS display_id, 
                rs.id,
                rs.member_information_id,
                rs.brand_id,
                rs.avatar,
                rs.salary,
                mi.full_name,
                mi.username,
                mi.role,
                mi.dob,
                mi.email,
                mi.phone,
                mi.gender,
                mi.address,
                mi.date_added,
                br.name AS brand_name, 
                br.logo_url
            FROM rcms_staff rs
            JOIN member_information mi ON rs.member_information_id = mi.id
            LEFT JOIN brand br ON br.id = rs.brand_id WHERE rs.id = $1`
            const staffResult = await pool.query(staffQuery, [id])

            res.status(200).json({
                staff: staffResult.rows[0]
            })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /rcms/rcms_staff/:id
    async updateARcmsStaff(req, res, next) {
        // Handle file upload with Promise wrapper
        const handleUpload = () => {
        return new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) return reject(err)
                    resolve()
                })
            })
        }

        try {
        // Process the file upload first
        await handleUpload()

        // Get form data
        const { full_name, username, password, email, phone, address, salary, gender, avatar, dob } = req.body
        const id = req.params.id
        
        // Process the uploaded avatar file if exists
        let finalAvatar = avatar // Use the provided avatar string if no file uploaded
        
        if (req.file) {
            // Convert image buffer to Base64 string
            const base64Image = req.file.buffer.toString('base64')
            finalAvatar = `data:${req.file.mimetype};base64,${base64Image}`
        }
        
        const client = await pool.connect()

        try {
            await client.query('BEGIN')
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
            FROM rcms_staff
            WHERE rcms_staff.member_information_id = member_information.id
            AND rcms_staff.id = $9
            `
            let hashedPassword = null;
            if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
            }
            await client.query(updateMemberQuery, [full_name, username, hashedPassword, email, phone, gender, address, dob, id])

            const updatestaffQuery = `
            UPDATE rcms_staff
            SET avatar = COALESCE($1, rcms_staff.avatar),
                salary = COALESCE($2, rcms_staff.salary)
            WHERE id = $3
            `
            await client.query(updatestaffQuery, [finalAvatar, salary, id])

            const selectMemberQuery = `
            SELECT * FROM member_information
            INNER JOIN rcms_staff ON rcms_staff.member_information_id = member_information.id
            WHERE rcms_staff.id = $1
            `
            const result = await client.query(selectMemberQuery, [id]);

            if (result.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ 
                message: "This ID doesn't exist." 
            })
            }

            const updatedUser = result.rows[0]
            await client.query('COMMIT')

            res.status(200).json({
            message: "Information updated successfully.",
            updatedUser: updatedUser
            })
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
        } catch (error) {
        next(error)
        }
    }

    // [DELETE] /rcms/rcms_staff/:id
    async deleteARcmsStaff(req, res, next) {
        try {
            const id = req.params.id;
            const deleteQuery = 'DELETE FROM rcms_staff WHERE id = $1'
            const result = await pool.query(deleteQuery, [id])

            if (result.rowCount > 0) {
                res.status(200).json({ 
                    message: 'RCMS staff deleted successfully.' 
                })
            } else {
                res.status(404).json({ 
                    message: 'RCMS staff not found.' 
                })
            }
        } catch (error) {
            next(error)
        }
    }
    //constructor() {
        //cron.schedule('*/30 * * * *', () => {
            //console.log('Cron job triggered: Running addData...')
            //this.addData({
                //importOptions: { blog: true, reservation: true, voucher: true }
            //})
        //})
    //}

    // [POST] /rcms/add/data
    async addData(reqOrOptions = {}) {
        let newPool = null

        try {
            const importOptions = reqOrOptions.body?.importOptions || 
                            reqOrOptions.importOptions || 
                            { blog: true, reservation: true, voucher: true }
            
            // Retrieve multiple connection strings instead of just one
            const connectionStringQuery = `SELECT id, url FROM connection_string;`
            const connectionStringResult = await pool.query(connectionStringQuery)
            const connectionStrings = connectionStringResult.rows
            
            console.log(`Found ${connectionStrings.length} database connections to process`)
            
            // Initialize sets to track processed IDs across ALL connections
            const processedIds = {
                brands: new Set(),
                branches: new Set(),
                staffs: new Set(),
                customers: new Set(),
                products: new Set(),
                orders: new Set(),
                vouchers: new Set(),
                blogs: new Set(),
                feedbacks: new Set(),
                reservations: new Set()
            };

            // Process each connection string
            for (const connection of connectionStrings) {
                console.log(`Processing database connection: ${connection.id}`)
                
                // Create a new pool for this connection
                newPool = new Pool({
                    connectionString: connection.url
                })

                console.log(`Connecting to new database (ID: ${connection.id})...`)

                try {
                    // Just check the connection - don't use connect() as it creates a client that needs to be released
                    await newPool.query('SELECT 1')
                    console.log(`New database connected successfully (ID: ${connection.id}).`)
                } catch (error) {
                    console.error(`Failed to connect to this new database (ID: ${connection.id}).`, error)
                    // Close the failed pool before continuing
                    if (newPool) {
                        await newPool.end()
                        newPool = null
                    }
                    continue
                }

                // Brand Data Import
                try {
                    console.log('Inserting Brand data...')

                    const brandQuery = `SELECT * FROM brand;`
                    const brandResult = await newPool.query(brandQuery)
                    const brands = brandResult.rows

                    for (let brand of brands) {
                        processedIds.brands.add(brand.id); // Add to the global tracking set

                        const brandInfoQuery = `
                            INSERT INTO brand (id, rcms_id, name, description, opening_hours, closed_hours, logo_url, website_url, status, date_added)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                            ON CONFLICT (id) DO UPDATE 
                            SET rcms_id = EXCLUDED.rcms_id,
                                name = EXCLUDED.name,
                                description = EXCLUDED.description,
                                opening_hours = EXCLUDED.opening_hours,
                                closed_hours = EXCLUDED.closed_hours,
                                logo_url = EXCLUDED.logo_url,
                                website_url = EXCLUDED.website_url,
                                status = EXCLUDED.status,
                                date_added = EXCLUDED.date_added;
                        `;
                        
                        const brandValues = [
                            brand.id,
                            brand.rcms_id = `${process.env.RCMS_ID}`,
                            brand.name,
                            brand.description,
                            brand.opening_hours,
                            brand.closed_hours,
                            brand.logo_url,
                            brand.website_url,
                            brand.status,
                            brand.date_added
                        ];
                        
                        await pool.query(brandInfoQuery, brandValues);
                    }

                    console.log("Brand data processed successfully for this connection.")
                } catch (error) {
                    console.error(`Failed to import Brand data from connection ${connection.id}:`, error)
                }

                // Branch Data Import
                try {
                    console.log('Inserting Branch data...')

                    const branchQuery = `SELECT * FROM branch;`
                    const branchResult = await newPool.query(branchQuery)
                    const branches = branchResult.rows

                    for (let branch of branches) {
                        processedIds.branches.add(branch.id); // Add to the global tracking set

                        const branchInfoQuery = `
                            INSERT INTO branch (id, brand_id, address, phone, status, date_added)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            ON CONFLICT (id) DO UPDATE 
                            SET brand_id = EXCLUDED.brand_id,
                                address = EXCLUDED.address,
                                phone = EXCLUDED.phone,
                                status = EXCLUDED.status,
                                date_added = EXCLUDED.date_added;
                        `;
                        
                        const branchValues = [
                            branch.id,
                            branch.brand_id,
                            branch.address,
                            branch.phone,
                            branch.status,
                            branch.date_added
                        ];
                        
                        await pool.query(branchInfoQuery, branchValues);
                    }

                    console.log("Branch data processed successfully for this connection.")
                } catch (error) {
                    console.error(`Failed to import Branch data from connection ${connection.id}:`, error)
                }
                
                // Staff
                try {
                    console.log("Inserting Staff data...")

                    const staffQuery = `SELECT * FROM member_information INNER JOIN staff ON staff.member_information_id = member_information.id;`
                    const staffResult = await newPool.query(staffQuery)
                    const staffs = staffResult.rows

                    for (let staff of staffs) {
                        processedIds.staffs.add(staff.id); // Add to the global tracking set

                        // Insert or update member information first
                        const memberInfoQuery = `
                            INSERT INTO member_information (id, full_name, username, password, role, email, phone, gender, address, date_added)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                            ON CONFLICT (id) DO UPDATE 
                            SET full_name = EXCLUDED.full_name,
                                username = EXCLUDED.username,
                                password = EXCLUDED.password,
                                role = EXCLUDED.role,
                                email = EXCLUDED.email,
                                phone = EXCLUDED.phone,
                                gender = EXCLUDED.gender,
                                address = EXCLUDED.address,
                                date_added = EXCLUDED.date_added;
                        `;
                        
                        const memberValues = [
                            staff.member_information_id,
                            staff.full_name,
                            staff.username,
                            staff.password,
                            staff.role,
                            staff.email,
                            staff.phone,
                            staff.gender,
                            staff.address,
                            staff.date_added,
                        ];
                        
                        await pool.query(memberInfoQuery, memberValues);

                        // Insert or update staff data
                        const staffQuery = `
                            INSERT INTO staff (id, member_information_id, branch_id, salary, avatar)
                            VALUES ($1, $2, $3, $4, $5)
                            ON CONFLICT (id) DO UPDATE 
                            SET member_information_id = EXCLUDED.member_information_id,
                                branch_id = EXCLUDED.branch_id,
                                salary = EXCLUDED.salary,
                                avatar = EXCLUDED.avatar;
                        `;

                        const staffValues = [
                            staff.id,
                            staff.member_information_id,
                            staff.branch_id,
                            staff.salary,
                            staff.avatar
                        ];

                        await pool.query(staffQuery, staffValues);
                    }

                    console.log("Staff data processed successfully for this connection.");
                } catch (error) {
                    console.error(`Failed to import Staff data from connection ${connection.id}:`, error)
                }

                // Customer
                try {
                    console.log("Inserting Customer data...")

                    const customerQuery = `SELECT * FROM member_information INNER JOIN customer ON customer.member_information_id = member_information.id;`
                    const customerResult = await newPool.query(customerQuery)
                    const customers = customerResult.rows

                    for (let customer of customers) {
                        processedIds.customers.add(customer.id); // Add to the global tracking set

                        // Insert or update member information first
                        const memberInfoQuery = `
                            INSERT INTO member_information (id, full_name, username, password, role, email, phone, gender, address, date_added)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                            ON CONFLICT (id) DO UPDATE 
                            SET full_name = EXCLUDED.full_name,
                                username = EXCLUDED.username,
                                password = EXCLUDED.password,
                                role = EXCLUDED.role,
                                email = EXCLUDED.email,
                                phone = EXCLUDED.phone,
                                gender = EXCLUDED.gender,
                                address = EXCLUDED.address,
                                date_added = EXCLUDED.date_added;
                        `;
                        
                        const memberValues = [
                            customer.member_information_id,
                            customer.full_name,
                            customer.username,
                            customer.password,
                            customer.role,
                            customer.email,
                            customer.phone,
                            customer.gender,
                            customer.address,
                            customer.date_added,
                        ];
                        
                        await pool.query(memberInfoQuery, memberValues);

                        // Insert or update customer data
                        const customerQuery = `
                            INSERT INTO customer (id, member_information_id, brand_id, cart, status, avatar)
                            VALUES ($1, $2, $3, $4::jsonb, 'Active', $5)
                            ON CONFLICT (id) DO UPDATE 
                            SET member_information_id = EXCLUDED.member_information_id,
                                brand_id = EXCLUDED.brand_id,
                                cart = EXCLUDED.cart,
                                status = EXCLUDED.status,
                                avatar = EXCLUDED.avatar;
                        `;

                        const customerValues = [
                            customer.id,
                            customer.member_information_id,
                            customer.brand_id,
                            JSON.stringify(customer.cart),
                            customer.avatar
                        ];

                        await pool.query(customerQuery, customerValues);
                    }

                    console.log("Customer data processed successfully for this connection.");
                } catch (error) {
                    console.error(`Failed to import Customer data from connection ${connection.id}:`, error)
                }
                
                // Product
                try {
                    console.log("Inserting Product data...")

                    const productQuery = `SELECT * FROM product;`
                    const productResult = await newPool.query(productQuery)
                    const products = productResult.rows

                    for (let product of products) {
                        processedIds.products.add(product.id); // Add to the global tracking set

                        const productInfoQuery = `
                            INSERT INTO product (id, brand_id, name, type, description, price, photo, date_added, stock)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            ON CONFLICT (id) DO UPDATE 
                            SET brand_id = EXCLUDED.brand_id,
                                name = EXCLUDED.name,
                                type = EXCLUDED.type,
                                description = EXCLUDED.description,
                                price = EXCLUDED.price,
                                photo = EXCLUDED.photo,
                                date_added = EXCLUDED.date_added,
                                stock = EXCLUDED.stock;
                        `;
                        
                        const productValues = [
                            product.id,
                            product.brand_id,
                            product.name,
                            product.type,
                            product.description,
                            product.price,
                            product.photo,
                            product.date_added,
                            product.stock
                        ];
                        
                        await pool.query(productInfoQuery, productValues);
                    }

                    console.log("Product data processed successfully for this connection.");
                } catch (error) {
                    console.error(`Failed to import Product data from connection ${connection.id}:`, error)
                }
                
                // Order
                try {
                    console.log("Inserting Order data...")

                    const orderQuery = `SELECT * FROM "order";`
                    const orderResult = await newPool.query(orderQuery)
                    const orders = orderResult.rows

                    for (let order of orders) {
                        processedIds.orders.add(order.id); // Add to the global tracking set

                        // Insert or update customer data
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

                    console.log("Order data processed successfully for this connection.")
                } catch (error) {
                    console.error(`Failed to import Order data from connection ${connection.id}:`, error)
                }
                
                // Voucher - Optional
                if (importOptions.voucher) {
                    try {
                        console.log("Inserting Voucher data...")
        
                        const voucherQuery = `SELECT * FROM voucher;`
                        const voucherResult = await newPool.query(voucherQuery)
                        const vouchers = voucherResult.rows
        
                        for (let voucher of vouchers) {
                            processedIds.vouchers.add(voucher.id); // Add to the global tracking set
        
                            const voucherInfoQuery = `
                                INSERT INTO voucher (id, title, discount_percent, code, status, start_date, end_date, type, discount_type, description, brand_id, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                                ON CONFLICT (id) DO UPDATE 
                                SET title = EXCLUDED.title,
                                    discount_percent = EXCLUDED.discount_percent,
                                    code = EXCLUDED.code,
                                    status = EXCLUDED.status,
                                    start_date = EXCLUDED.start_date,
                                    end_date = EXCLUDED.end_date,
                                    type = EXCLUDED.type,
                                    discount_type = EXCLUDED.discount_type,
                                    description = EXCLUDED.description,
                                    brand_id = EXCLUDED.brand_id,
                                    date_added = EXCLUDED.date_added;
                            `;
                            
                            const voucherValues = [
                                voucher.id,
                                voucher.title,
                                voucher.discount_percent,
                                voucher.code,
                                voucher.status,
                                voucher.start_date,
                                voucher.end_date,
                                voucher.type,
                                voucher.discount_type,
                                voucher.description,
                                voucher.brand_id,
                                voucher.date_added
                            ];
                            
                            await pool.query(voucherInfoQuery, voucherValues);
                        }
        
                        console.log("Voucher data processed successfully for this connection.");
                    } catch (error) {
                        console.error(`Voucher data skipped for connection ${connection.id}:`, error)  
                    }
                }
                
                // Blog - Optional
                if (importOptions.blog) {
                    try {
                        console.log("Inserting Blog data...")
        
                        const blogQuery = `SELECT * FROM blog;`
                        const blogResult = await newPool.query(blogQuery)
                        const blogs = blogResult.rows
        
                        for (let blog of blogs) {
                            processedIds.blogs.add(blog.id); // Add to the global tracking set
        
                            const blogInfoQuery = `
                                INSERT INTO blog (id, staff_id, content, title, photo, date_added, status)
                                VALUES ($1, $2, $3, $4, $5, $6, $7)
                                ON CONFLICT (id) DO UPDATE 
                                SET staff_id = EXCLUDED.staff_id,
                                    content = EXCLUDED.content,
                                    title = EXCLUDED.title,
                                    photo = EXCLUDED.photo,
                                    date_added = EXCLUDED.date_added,
                                    status = EXCLUDED.status;
                            `;
                            
                            const blogValues = [
                                blog.id,
                                blog.staff_id,
                                blog.content,
                                blog.title,
                                JSON.stringify(blog.photo),
                                blog.date_added,
                                blog.status
                            ];
                            
                            await pool.query(blogInfoQuery, blogValues);
                        }
        
                        console.log("Blog data processed successfully for this connection.");
                    } catch (error) {
                        console.error(`Blog data skipped for connection ${connection.id}:`, error)
                    }
                }
                
                // Feedback
                try {
                    console.log("Inserting Feedback data...")

                    const feedbackQuery = `SELECT * FROM feedback;`
                    const feedbackResult = await newPool.query(feedbackQuery)
                    const feedbacks = feedbackResult.rows

                    for (let feedback of feedbacks) {
                        processedIds.feedbacks.add(feedback.id); // Add to the global tracking set

                        const feedbackInfoQuery = `
                            INSERT INTO feedback (id, customer_id, branch_id, type, content, status, solved_by, updated_at, date_added)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            ON CONFLICT (id) DO UPDATE 
                            SET customer_id = EXCLUDED.customer_id,
                                branch_id = EXCLUDED.branch_id,
                                type = EXCLUDED.type,
                                content = EXCLUDED.content,
                                status = EXCLUDED.status,
                                solved_by = EXCLUDED.solved_by,
                                updated_at = EXCLUDED.updated_at,
                                date_added = EXCLUDED.date_added;
                        `;
                        
                        const feedbackValues = [
                            feedback.id,
                            feedback.customer_id,
                            feedback.branch_id,
                            feedback.type,
                            feedback.content,
                            feedback.status,
                            feedback.solved_by,
                            feedback.updated_at,
                            feedback.date_added
                        ];
                        
                        await pool.query(feedbackInfoQuery, feedbackValues);
                    }

                    console.log("Feedback data processed successfully for this connection.");
                } catch (error) {
                    console.error(`Failed to import Feedback data from connection ${connection.id}:`, error)
                }
                
                // Reservation - Optional
                if (importOptions.reservation) {
                    try {
                        console.log("Inserting Reservation data...")
        
                        const reservationQuery = `SELECT * FROM reservation;`
                        const reservationResult = await newPool.query(reservationQuery)
                        const reservations = reservationResult.rows
        
                        for (let reservation of reservations) {
                            processedIds.reservations.add(reservation.id); // Add to the global tracking set
        
                            const reservationInfoQuery = `
                                INSERT INTO reservation (id, full_name, phone, branch_id, reservation_time, reservation_date, number_of_customer, status, place, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                ON CONFLICT (id) DO UPDATE 
                                SET full_name = EXCLUDED.full_name,
                                    phone = EXCLUDED.phone,
                                    branch_id = EXCLUDED.branch_id,
                                    reservation_time = EXCLUDED.reservation_time,
                                    reservation_date = EXCLUDED.reservation_date,
                                    number_of_customer = EXCLUDED.number_of_customer,
                                    status = EXCLUDED.status,
                                    place = EXCLUDED.place,
                                    date_added = EXCLUDED.date_added;
                            `;
                            
                            const reservationValues = [
                                reservation.id,
                                reservation.full_name,
                                reservation.phone,
                                reservation.branch_id,
                                reservation.reservation_time,
                                reservation.reservation_date,
                                reservation.number_of_customer,
                                reservation.status,
                                reservation.place,
                                reservation.date_added
                            ];
                            
                            await pool.query(reservationInfoQuery, reservationValues);
                        }
        
                        console.log("Reservation data processed successfully for this connection.");
                    } catch (error) {
                        console.error(`Reservation data skipped for connection ${connection.id}:`, error)
                    }
                }

                console.log(`All data from database connection ${connection.id} processed successfully.`)
                
                // Close the connection for this database before moving to the next one
                if (newPool) {
                    await newPool.end()
                    console.log(`Database connection ${connection.id} closed successfully.`)
                    newPool = null
                }
            }

            // After processing all connections, perform the deletion of records not found in any connection
            // This ensures we only delete records that aren't in ANY of the source databases
            try {
                // Get existing IDs from the destination database
                const existingIds = {
                    brands: new Set(),
                    branches: new Set(),
                    staffs: new Set(),
                    customers: new Set(),
                    products: new Set(),
                    orders: new Set(),
                    vouchers: new Set(),
                    blogs: new Set(),
                    feedbacks: new Set(),
                    reservations: new Set()
                };

                // Fetch existing IDs from destination database
                const existingBrandsResult = await pool.query("SELECT id FROM brand");
                existingIds.brands = new Set(existingBrandsResult.rows.map(row => row.id));

                const existingBranchesResult = await pool.query("SELECT id FROM branch");
                existingIds.branches = new Set(existingBranchesResult.rows.map(row => row.id));

                const existingStaffsResult = await pool.query("SELECT id FROM staff");
                existingIds.staffs = new Set(existingStaffsResult.rows.map(row => row.id));

                const existingCustomersResult = await pool.query("SELECT id FROM customer");
                existingIds.customers = new Set(existingCustomersResult.rows.map(row => row.id));

                const existingProductsResult = await pool.query("SELECT id FROM product");
                existingIds.products = new Set(existingProductsResult.rows.map(row => row.id));

                const existingOrdersResult = await pool.query('SELECT id FROM "order"');
                existingIds.orders = new Set(existingOrdersResult.rows.map(row => row.id));

                if (importOptions.voucher) {
                    const existingVouchersResult = await pool.query("SELECT id FROM voucher");
                    existingIds.vouchers = new Set(existingVouchersResult.rows.map(row => row.id));
                }

                if (importOptions.blog) {
                    const existingBlogsResult = await pool.query("SELECT id FROM blog");
                    existingIds.blogs = new Set(existingBlogsResult.rows.map(row => row.id));
                }

                const existingFeedbacksResult = await pool.query("SELECT id FROM feedback");
                existingIds.feedbacks = new Set(existingFeedbacksResult.rows.map(row => row.id));

                if (importOptions.reservation) {
                    const existingReservationsResult = await pool.query("SELECT id FROM reservation");
                    existingIds.reservations = new Set(existingReservationsResult.rows.map(row => row.id));
                }

                // Delete records that weren't processed (not found in any source database)
                const deleteBrands = [...existingIds.brands].filter(id => !processedIds.brands.has(id));
                if (deleteBrands.length > 0) {
                    console.log(`Deleting brands: ${deleteBrands.join(", ")}`);
                    await pool.query("DELETE FROM brand WHERE id = ANY($1)", [deleteBrands]);
                }

                const deleteBranches = [...existingIds.branches].filter(id => !processedIds.branches.has(id));
                if (deleteBranches.length > 0) {
                    console.log(`Deleting branches: ${deleteBranches.join(", ")}`);
                    await pool.query("DELETE FROM branch WHERE id = ANY($1)", [deleteBranches]);
                }

                const deleteStaffs = [...existingIds.staffs].filter(id => !processedIds.staffs.has(id));
                if (deleteStaffs.length > 0) {
                    console.log(`Deleting staffs: ${deleteStaffs.join(", ")}`);
                    await pool.query("DELETE FROM staff WHERE id = ANY($1)", [deleteStaffs]);
                }

                const deleteCustomers = [...existingIds.customers].filter(id => !processedIds.customers.has(id));
                if (deleteCustomers.length > 0) {
                    console.log(`Deleting customers: ${deleteCustomers.join(", ")}`);
                    await pool.query("DELETE FROM customer WHERE id = ANY($1)", [deleteCustomers]);
                }

                const deleteProducts = [...existingIds.products].filter(id => !processedIds.products.has(id));
                if (deleteProducts.length > 0) {
                    console.log(`Deleting products: ${deleteProducts.join(", ")}`);
                    await pool.query("DELETE FROM product WHERE id = ANY($1)", [deleteProducts]);
                }

                const deleteOrders = [...existingIds.orders].filter(id => !processedIds.orders.has(id));
                if (deleteOrders.length > 0) {
                    console.log(`Deleting orders: ${deleteOrders.join(", ")}`);
                    await pool.query('DELETE FROM "order" WHERE id = ANY($1)', [deleteOrders]);
                }

                if (importOptions.voucher) {
                    const deleteVouchers = [...existingIds.vouchers].filter(id => !processedIds.vouchers.has(id));
                    if (deleteVouchers.length > 0) {
                        console.log(`Deleting vouchers: ${deleteVouchers.join(", ")}`);
                        await pool.query("DELETE FROM voucher WHERE id = ANY($1)", [deleteVouchers]);
                    }
                }

                if (importOptions.blog) {
                    const deleteBlogs = [...existingIds.blogs].filter(id => !processedIds.blogs.has(id));
                    if (deleteBlogs.length > 0) {
                        console.log(`Deleting blogs: ${deleteBlogs.join(", ")}`);
                        await pool.query("DELETE FROM blog WHERE id = ANY($1)", [deleteBlogs]);
                    }
                }

                const deleteFeedbacks = [...existingIds.feedbacks].filter(id => !processedIds.feedbacks.has(id));
                if (deleteFeedbacks.length > 0) {
                    console.log(`Deleting feedbacks: ${deleteFeedbacks.join(", ")}`);
                    await pool.query("DELETE FROM feedback WHERE id = ANY($1)", [deleteFeedbacks]);
                }

                if (importOptions.reservation) {
                    const deleteReservations = [...existingIds.reservations].filter(id => !processedIds.reservations.has(id));
                    if (deleteReservations.length > 0) {
                        console.log(`Deleting reservations: ${deleteReservations.join(", ")}`);
                        await pool.query("DELETE FROM reservation WHERE id = ANY($1)", [deleteReservations]);
                    }
                }

                console.log('All cleanup operations completed successfully.');
            } catch (error) {
                console.error('Error during cleanup operations:', error);
            }

            console.log('All database connections processed successfully.')
        } catch (error) {
            console.error('Error processing multiple database connections:', error)
        } finally {
            // Make sure to close the connection pool if it's still open
            if (newPool) {
                await newPool.end()
                console.log('Database connection closed.')
            }
        }
    }

    // [GET] /rcms
    async readAllRcms(req, res, next) {
        try {
            const rcmsQuery = 'SELECT * FROM rcms;'
            const rcmsResult = await pool.query(rcmsQuery)

            res.status(200).json({
                rcms: rcmsResult.rows
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /rcms
    async createARcms(req, res, next) {
        try {
            const { logo_url, website_url, key } = req.body

            if (!key) {
                return res.status(401).json('Please enter the key to continue.')
            } else if (key != process.env.RCMS_KEY) {
                return res.status(401).json('Incorrect key, please try again.')
            }

            const query = `
                INSERT INTO rcms (logo_url, website_url) VALUES ($1, $2)
                RETURNING id;
            `
            const values = [logo_url, website_url]
            const result = await pool.query(query, values)

            res.status(201).json({
                message: 'RCMS added.',
                id: result.rows[0].id
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /rcms/add/url
    async saveConnectionString(req, res, next) {
        const client = await pool.connect()
        let newPool = null
        let importedData = {
            brands: [], // Finished
            branches: [], // Finished
            staffs: [], // Finished
            customers: [], // Finished
            products: [], // Finished
            orders: [], // Finished
            vouchers: [], // Finished
            blogs: [], // Finished
            feedbacks: [], // Finished
            reservations: [] // Finished
        }

        const { url, name } = req.body

        // First, save the connection string to the database
        const connectionStringQuery = `
            INSERT INTO connection_string (url, name) VALUES ($1, $2)
            RETURNING id;
        `
        const connectionStringValues = [url, name]
        const connectionStringResult = await client.query(connectionStringQuery, connectionStringValues)
        const connectionStringId = connectionStringResult.rows[0].id

        try {
            // Create a new pool for this connection
            newPool = new Pool({
                connectionString: url
            })

            // Test the connection
            await newPool.query('SELECT 1')

            // Mandatory tables to import (these must succeed)
            const mandatoryTables = [
                { 
                    name: 'brands', 
                    query: 'SELECT * FROM brand;',
                    importFn: async (brands) => {
                        const importedBrands = []
                        for (let brand of brands) {
                            const brandInfoQuery = `
                                INSERT INTO brand (id, rcms_id, name, description, opening_hours, closed_hours, logo_url, website_url, status, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                RETURNING id;
                            `;
                            
                            const brandValues = [
                                brand.id,
                                `${process.env.RCMS_ID}`,
                                brand.name,
                                brand.description,
                                brand.opening_hours,
                                brand.closed_hours,
                                brand.logo_url,
                                brand.website_url,
                                brand.status,
                                brand.date_added
                            ];
                            
                            const result = await client.query(brandInfoQuery, brandValues)
                            importedBrands.push(result.rows[0].id)
                        }
                        return importedBrands
                    }
                },
                { 
                    name: 'branches', 
                    query: 'SELECT * FROM branch;',
                    importFn: async (branches) => {
                        const importedBranches = []
                        for (let branch of branches) {
                            const branchInfoQuery = `
                                INSERT INTO branch (id, brand_id, address, phone, status, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6)
                                RETURNING id;
                            `;
                            
                            const branchValues = [
                                branch.id,
                                branch.brand_id,
                                branch.address,
                                branch.phone,
                                branch.status,
                                branch.date_added
                            ];
                            
                            const result = await client.query(branchInfoQuery, branchValues)
                            importedBranches.push(result.rows[0].id)
                        }
                        return importedBranches
                    }
                },
                { 
                    name: 'staffs', 
                    query: 'SELECT * FROM member_information INNER JOIN staff ON staff.member_information_id = member_information.id;',
                    importFn: async (staffs) => {
                        const importedStaffs = []
                        for (let staff of staffs) {
                            // Insert member information
                            const memberInfoQuery = `
                                INSERT INTO member_information (id, full_name, username, password, role, email, phone, gender, address, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                ON CONFLICT (id) DO UPDATE 
                                SET full_name = EXCLUDED.full_name,
                                    username = EXCLUDED.username,
                                    password = EXCLUDED.password,
                                    role = EXCLUDED.role,
                                    email = EXCLUDED.email,
                                    phone = EXCLUDED.phone,
                                    gender = EXCLUDED.gender,
                                    address = EXCLUDED.address,
                                    date_added = EXCLUDED.date_added
                                RETURNING id;
                            `;
                            
                            const memberValues = [
                                staff.member_information_id,
                                staff.full_name,
                                staff.username,
                                staff.password,
                                staff.role,
                                staff.email,
                                staff.phone,
                                staff.gender,
                                staff.address,
                                staff.date_added,
                            ];
                            
                            const memberResult = await client.query(memberInfoQuery, memberValues)

                            // Insert staff data
                            const staffQuery = `
                                INSERT INTO staff (id, member_information_id, branch_id, salary, avatar)
                                VALUES ($1, $2, $3, $4, $5)
                                ON CONFLICT (id) DO UPDATE 
                                SET member_information_id = EXCLUDED.member_information_id,
                                    branch_id = EXCLUDED.branch_id,
                                    salary = EXCLUDED.salary,
                                    avatar = EXCLUDED.avatar
                                RETURNING id;
                            `;

                            const staffValues = [
                                staff.id,
                                staff.member_information_id,
                                staff.branch_id,
                                staff.salary,
                                staff.avatar
                            ];

                            const staffResult = await client.query(staffQuery, staffValues)
                            importedStaffs.push(staffResult.rows[0].id)
                        }
                        return importedStaffs
                    }
                },
                { 
                    name: 'customers', 
                    query: 'SELECT * FROM member_information INNER JOIN customer ON customer.member_information_id = member_information.id;',
                    importFn: async (customers) => {
                        const importedCustomers = []
                        for (let customer of customers) {
                            // Insert member information
                            const memberInfoQuery = `
                                INSERT INTO member_information (id, full_name, username, password, role, email, phone, gender, address, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                ON CONFLICT (id) DO UPDATE 
                                SET full_name = EXCLUDED.full_name,
                                    username = EXCLUDED.username,
                                    password = EXCLUDED.password,
                                    role = EXCLUDED.role,
                                    email = EXCLUDED.email,
                                    phone = EXCLUDED.phone,
                                    gender = EXCLUDED.gender,
                                    address = EXCLUDED.address,
                                    date_added = EXCLUDED.date_added
                                RETURNING id;
                            `;
                            
                            const memberValues = [
                                customer.member_information_id,
                                customer.full_name,
                                customer.username,
                                customer.password,
                                customer.role,
                                customer.email,
                                customer.phone,
                                customer.gender,
                                customer.address,
                                customer.date_added,
                            ];
                            
                            const memberResult = await client.query(memberInfoQuery, memberValues)

                            // Insert customer data
                            const customerQuery = `
                                INSERT INTO customer (id, member_information_id, brand_id, cart, status, avatar)
                                VALUES ($1, $2, $3, $4::jsonb, 'Active', $5)
                                ON CONFLICT (id) DO UPDATE 
                                SET member_information_id = EXCLUDED.member_information_id,
                                    brand_id = EXCLUDED.brand_id,
                                    cart = EXCLUDED.cart,
                                    status = EXCLUDED.status,
                                    avatar = EXCLUDED.avatar
                                RETURNING id;
                            `;

                            const customerValues = [
                                customer.id,
                                customer.member_information_id,
                                customer.brand_id,
                                JSON.stringify(customer.cart),
                                customer.avatar
                            ];

                            const customerResult = await client.query(customerQuery, customerValues)
                            importedCustomers.push(customerResult.rows[0].id)
                        }
                        return importedCustomers
                    }
                },
                { 
                    name: 'products', 
                    query: 'SELECT * FROM product;',
                    importFn: async (products) => {
                        const importedProducts = []
                        for (let product of products) {
                            const productInfoQuery = `
                                INSERT INTO product (id, brand_id, name, type, description, price, photo, date_added, stock)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                                ON CONFLICT (id) DO UPDATE 
                                SET brand_id = EXCLUDED.brand_id,
                                    name = EXCLUDED.name,
                                    type = EXCLUDED.type,
                                    description = EXCLUDED.description,
                                    price = EXCLUDED.price,
                                    photo = EXCLUDED.photo,
                                    date_added = EXCLUDED.date_added,
                                    stock = EXCLUDED.stock
                                RETURNING id;
                            `;
                            
                            const productValues = [
                                product.id,
                                product.brand_id,
                                product.name,
                                product.type,
                                product.description,
                                product.price,
                                product.photo,
                                product.date_added,
                                product.stock
                            ];
                            
                            const result = await client.query(productInfoQuery, productValues)
                            importedProducts.push(result.rows[0].id)
                        }
                        return importedProducts
                    }
                },
                { 
                    name: 'orders', 
                    query: `SELECT * FROM "order";`,
                    importFn: async (orders) => {
                        const importedOrders = []
                        for (let order of orders) {
                            const orderInfoQuery = `
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
                            
                            const result = await client.query(orderInfoQuery, orderValues)
                            importedOrders.push(result.rows[0].id)
                        }
                        return importedOrders
                    }
                },
                { 
                    name: 'feedbacks', 
                    query: 'SELECT * FROM feedback;',
                    importFn: async (feedbacks) => {
                        const importedFeedbacks = []
                        for (let feedback of feedbacks) {
                            const feedbackInfoQuery = `
                                INSERT INTO feedback (id, customer_id, branch_id, type, content, status, solved_by, updated_at, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                                ON CONFLICT (id) DO UPDATE 
                                SET customer_id = EXCLUDED.customer_id,
                                    branch_id = EXCLUDED.branch_id,
                                    type = EXCLUDED.type,
                                    content = EXCLUDED.content,
                                    status = EXCLUDED.status,
                                    solved_by = EXCLUDED.solved_by,
                                    updated_at = EXCLUDED.updated_at,
                                    date_added = EXCLUDED.date_added;
                            `;
                            
                            const feedbackValues = [
                                feedback.id,
                                feedback.customer_id,
                                feedback.branch_id,
                                feedback.type,
                                feedback.content,
                                feedback.status,
                                feedback.solved_by,
                                feedback.updated_at,
                                feedback.date_added
                            ];
                            
                            const result = await client.query(feedbackInfoQuery, feedbackValues)
                            importedFeedbacks.push(result.rows[0].id)
                        }
                        return importedFeedbacks
                    }
                }
            ]

            // Optional tables to import
            const optionalTables = [
                { 
                    name: 'vouchers', 
                    query: 'SELECT * FROM voucher;',
                    importFn: async (vouchers) => {
                        const importedVouchers = []
                        for (let voucher of vouchers) {
                            const voucherInfoQuery = `
                                INSERT INTO voucher (id, title, discount_percent, code, status, start_date, end_date, type, discount_type, description, brand_id, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                                ON CONFLICT (id) DO UPDATE 
                                SET title = EXCLUDED.title,
                                    discount_percent = EXCLUDED.discount_percent,
                                    code = EXCLUDED.code,
                                    status = EXCLUDED.status,
                                    start_date = EXCLUDED.start_date,
                                    end_date = EXCLUDED.end_date,
                                    type = EXCLUDED.type,
                                    discount_type = EXCLUDED.discount_type,
                                    description = EXCLUDED.description,
                                    brand_id = EXCLUDED.brand_id,
                                    date_added = EXCLUDED.date_added;
                            `;
                            
                            const voucherValues = [
                                voucher.id,
                                voucher.title,
                                voucher.discount_percent,
                                voucher.code,
                                voucher.status,
                                voucher.start_date,
                                voucher.end_date,
                                voucher.type,
                                voucher.discount_type,
                                voucher.description,
                                voucher.brand_id,
                                voucher.date_added
                            ];
                            
                            const result = await client.query(voucherInfoQuery, voucherValues)
                            importedVouchers.push(result.rows[0].id)
                        }
                        return importedVouchers
                    }
                },
                { 
                    name: 'blogs', 
                    query: 'SELECT * FROM blog;',
                    importFn: async (blogs) => {
                        const importedBlogs = []
                        for (let blog of blogs) {
                            const blogInfoQuery = `
                                INSERT INTO blog (id, staff_id, content, title, photo, date_added, status)
                                VALUES ($1, $2, $3, $4, $5, $6)
                                ON CONFLICT (id) DO UPDATE 
                                SET staff_id = EXCLUDED.staff_id,
                                    content = EXCLUDED.content,
                                    title = EXCLUDED.title,
                                    photo = EXCLUDED.photo,
                                    date_added = EXCLUDED.date_added,
                                    status = EXCLUDED.status;
                            `;
                            
                            const blogValues = [
                                blog.id,
                                blog.staff_id,
                                blog.content,
                                blog.title,
                                blog.photo,
                                blog.date_added,
                                blog.status
                            ];
                            
                            const result = await client.query(blogInfoQuery, blogValues)
                            importedBlogs.push(result.rows[0].id)
                        }
                        return importedBlogs
                    }
                },
                { 
                    name: 'reservations', 
                    query: 'SELECT * FROM reservation;',
                    importFn: async (reservations) => {
                        const importedReservations = []
                        for (let reservation of reservations) {
                            const reservationInfoQuery = `
                                INSERT INTO reservation (id, full_name, phone, branch_id, reservation_time, reservation_date, number_of_customer, status, place, date_added)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                ON CONFLICT (id) DO UPDATE 
                                SET full_name = EXCLUDED.full_name,
                                    phone = EXCLUDED.phone,
                                    branch_id = EXCLUDED.branch_id,
                                    reservation_time = EXCLUDED.reservation_time,
                                    reservation_date = EXCLUDED.reservation_date,
                                    number_of_customer = EXCLUDED.number_of_customer,
                                    status = EXCLUDED.status,
                                    place = EXCLUDED.place,
                                    date_added = EXCLUDED.date_added;
                            `;
                            
                            const reservationValues = [
                                reservation.id,
                                reservation.full_name,
                                reservation.phone,
                                reservation.branch_id,
                                reservation.reservation_time,
                                reservation.reservation_date,
                                reservation.number_of_customer,
                                reservation.status,
                                reservation.place,
                                reservation.date_added
                            ];
                            
                            const result = await client.query(reservationInfoQuery, reservationValues)
                            importedReservations.push(result.rows[0].id)
                        }
                        return importedReservations
                    }
                }
            ]

            // Import mandatory tables first
            for (let table of mandatoryTables) {
                const tableResult = await newPool.query(table.query)
                importedData[table.name] = await table.importFn(tableResult.rows)
            }

            // Import optional tables
            for (let table of optionalTables) {
                try {
                    const tableResult = await newPool.query(table.query)
                    importedData[table.name] = await table.importFn(tableResult.rows)
                } catch (error) {
                    console.warn(`Optional table ${table.name} import failed:`, error)
                    // Continue with other tables even if one fails
                }
            }

            res.status(201).json({
                message: 'Database connection string added and data imported successfully.',
                importedData
            })
        } catch (error) {
            // Rollback any imported data for mandatory tables
            try {
                // Delete imported data in reverse order to handle foreign key constraints
                if (importedData.branches.length) {
                    await client.query('DELETE FROM branch WHERE id = ANY($1)', [importedData.branches])
                }
                if (importedData.brands.length) {
                    await client.query('DELETE FROM brand WHERE id = ANY($1)', [importedData.brands])
                }
                // Delete the connection string that was just added
                await client.query('DELETE FROM connection_string WHERE id = $1', [connectionStringId])
            } catch (rollbackError) {
                console.error('Error during rollback:', rollbackError)
            }

            // Pass the original error to the error handling middleware
            res.status(500).json({
                message: 'Failed to import data',
                error: error
            })
        } finally {
            // Release the client back to the pool
            client.release()
            
            // Close the new pool if it was created
            if (newPool) {
                await newPool.end()
            }
        }
    }

    // [PUT] /rcms/rcms_staff/info
    async updateInfo(req, res, next) {
        const { username, email, phone, address, oldPassword, newPassword } = req.body
        const token = req.headers.authorization.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const id = decoded.id
            const updateAdminQuery = `
                UPDATE member_information
                SET email = COALESCE($1, username), phone = COALESCE($2, phone), address = COALESCE($3, address), username = COALESCE($4, username),
                password = COALESCE($5, password)
                FROM rcms_staff WHERE rcms_staff.member_information_id = member_information.id AND rcms_staff.id = $6
                RETURNING member_information.*;
            `
            const adminQuery = 'SELECT * FROM rcms_staff INNER JOIN member_information ON staff.member_information_id = member_information.id WHERE staff.id = $1;'
            const result = await pool.query(adminQuery, [id])
            const rcms_staff = result.rows[0]
            const passwordMatch = await bcrypt.compare(oldPassword, rcms_staff.password)

            if (!passwordMatch) {
                return res.status(401).json('Old password is incorrect.')
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            let result2 = await pool.query(updateAdminQuery, [email, phone, address, username, hashedPassword, id])
            console.log(result.rows[0]) // To use 'RETURNING member_information.*'

            if (result2.rows.length === 0) {
                return res.status(404).json({ message: "This ID doesn't exist." })
            }

            const updatedUser = result.rows[0]
            const newToken = jwt.sign({
                id: updatedUser.id,
                username: updatedUser.username,
                name: updatedUser.name,
                role: updatedUser.role,
            }, process.env.SECRET_KEY, { expiresIn: '1h' })

            res.status(200).json({
                message: "Information updated successfully.",
                token: newToken
            })
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new RCMSController