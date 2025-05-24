require('dotenv').config()

const { pool } = require('../../../config/db')
const cron = require('node-cron')

class SaleReportController
{
    constructor() {
        cron.schedule('0 0 * * *', () => {
            console.log('Cron job triggered: Running createASaleReport...')
            this.createASaleReport()
        })
    }

    // [GET] /sale_report
    async readAllSaleReports(req, res, next) {
        try {
            // 1. Get all brands
            const brandQuery = 'SELECT id, name FROM brand;'
            const brandResult = await pool.query(brandQuery)
            const brands = brandResult.rows.reduce((acc, brand) => {
                acc[brand.id] = brand.name
                return acc
            }, {})
            
            // 2. Get all branches
            const branchQuery = 'SELECT id, brand_id, address FROM branch;'
            const branchResult = await pool.query(branchQuery)
            const branches = branchResult.rows
            
            // Create a lookup for branch details by ID
            const branchDetails = branches.reduce((acc, branch) => {
                acc[branch.id] = {
                    address: branch.address,
                    brand_id: branch.brand_id
                }
                return acc
            }, {})
            
            // Group branches by brand
            const branchesByBrand = branches.reduce((acc, branch) => {
                if (!acc[branch.brand_id]) {
                    acc[branch.brand_id] = [];
                }
                acc[branch.brand_id].push(branch);
                return acc;
            }, {});
            
            // 3. Get all orders (we'll calculate metrics directly from orders)
            const ordersQuery = 'SELECT * FROM "order";'
            const ordersResult = await pool.query(ordersQuery)
            
            // 4. Get customers with their registration dates
            const customersQuery = `
                SELECT c.id, c.brand_id, mi.date_added 
                FROM customer c
                JOIN member_information mi ON c.member_information_id = mi.id
                ORDER BY mi.date_added ASC;
            `
            const customersResult = await pool.query(customersQuery)
            
            // Group customers by brand and month/year of registration
            const customersByBrandAndMonth = {}
            
            customersResult.rows.forEach(customer => {
                const registrationDate = new Date(customer.date_added)
                const month = registrationDate.getMonth() + 1
                const year = registrationDate.getFullYear()
                const brandId = customer.brand_id
                
                const key = `${brandId}-${year}`
                if (!customersByBrandAndMonth[key]) {
                    customersByBrandAndMonth[key] = Array(12).fill(0)
                }
                
                // Increment count for this month (0-indexed array)
                customersByBrandAndMonth[key][month - 1]++
            })
            
            // 5. Get branch-specific staff
            const branchStaffQuery = 'SELECT branch_id, COUNT(*) as staff_count FROM staff GROUP BY branch_id;'
            const branchStaff = await pool.query(branchStaffQuery)
            const staffByBranch = branchStaff.rows.reduce((acc, row) => {
                acc[row.branch_id] = parseInt(row.staff_count)
                return acc
            }, {})
            
            // 6. Process orders into branch-specific data
            // Create maps to hold branch and brand data
            const branchDataMap = new Map() // key: branch_id-month-year
            const brandDataMap = new Map()  // key: brand_id-month-year
            
            // Get current date for determining months to include
            const currentDate = new Date()
            const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
            const currentYear = currentDate.getFullYear()
            
            // Process each order
            ordersResult.rows.forEach(order => {
                const orderDate = new Date(order.date_added)
                const month = orderDate.getMonth() + 1
                const year = orderDate.getFullYear()
                const branchId = order.branch_id
                
                // Skip if no branch ID
                if (!branchId || !branchDetails[branchId]) {
                    return
                }
                
                const brandId = branchDetails[branchId].brand_id
                
                // Only process completed orders for revenue and order count
                if (order.status !== 'Completed') {
                    return
                }
                
                // Calculate revenue from order cart
                let orderRevenue = 0
                try {
                    const cart = typeof order.cart === 'string' ? JSON.parse(order.cart) : order.cart
                    orderRevenue = cart.total_price || 0
                } catch (e) {
                    console.error(`Error processing order ${order.id}:`, e)
                }
                
                // Create branch data entry if it doesn't exist
                const branchKey = `${branchId}-${month}-${year}`
                if (!branchDataMap.has(branchKey)) {
                    branchDataMap.set(branchKey, {
                        branch_id: branchId,
                        branch_address: branchDetails[branchId].address,
                        brand_id: brandId,
                        total_revenue: 0,
                        total_orders: 0,
                        total_staffs: staffByBranch[branchId] || 0,
                        total_customers: 0, // Will be calculated later based on cumulative customers
                        month: month,
                        year: year
                    })
                }
                
                // Update branch data
                const branchData = branchDataMap.get(branchKey)
                branchData.total_revenue += orderRevenue
                branchData.total_orders += 1
                
                // Create or update brand data entry
                const brandKey = `${brandId}-${month}-${year}`
                if (!brandDataMap.has(brandKey)) {
                    brandDataMap.set(brandKey, {
                        brand_id: brandId,
                        brand_name: brands[brandId] || 'Unknown',
                        total_revenue: 0,
                        total_orders: 0,
                        total_staffs: 0,
                        total_customers: 0, // Will be calculated later based on cumulative customers
                        month: month,
                        year: year
                    })
                }
                
                // Update brand data
                const brandData = brandDataMap.get(brandKey)
                brandData.total_revenue += orderRevenue
                brandData.total_orders += 1
            })
            
            // 7. Ensure all brands have entries for all branches and all months
            Object.keys(branchesByBrand).forEach(brandId => {
                const brandBranches = branchesByBrand[brandId]
                
                // For each branch of this brand
                brandBranches.forEach(branch => {
                    const branchId = branch.id
                    
                    // For each month from January to current month
                    for (let month = 1; month <= currentMonth; month++) {
                        const branchKey = `${branchId}-${month}-${currentYear}`
                        
                        // If we don't have data for this branch-month combination, create an empty entry
                        if (!branchDataMap.has(branchKey)) {
                            branchDataMap.set(branchKey, {
                                branch_id: branchId,
                                branch_address: branch.address,
                                brand_id: brandId,
                                total_revenue: 0,
                                total_orders: 0,
                                total_staffs: staffByBranch[branchId] || 0,
                                total_customers: 0, // Will be calculated later
                                month: month,
                                year: currentYear
                            })
                        }
                        
                        // Make sure the brand has an entry for this month
                        const brandKey = `${brandId}-${month}-${currentYear}`
                        if (!brandDataMap.has(brandKey)) {
                            brandDataMap.set(brandKey, {
                                brand_id: brandId,
                                brand_name: brands[brandId] || 'Unknown',
                                total_revenue: 0,
                                total_orders: 0,
                                total_staffs: 0,
                                total_customers: 0, // Will be calculated later
                                month: month,
                                year: currentYear
                            })
                        }
                        
                        // Add branch staff count to brand total staff
                        const brandData = brandDataMap.get(brandKey)
                        brandData.total_staffs += staffByBranch[branchId] || 0
                    }
                })
            })
            
            // 8. Calculate cumulative customer counts for each brand/month
            Object.keys(branchesByBrand).forEach(brandId => {
                // For each month from January to current month of the current year
                let cumulativeCustomers = 0
                
                // Get any customers from previous years
                for (let y = 2020; y < currentYear; y++) { // Assuming your business started in 2020 or later
                    const keyPrevYear = `${brandId}-${y}`
                    if (customersByBrandAndMonth[keyPrevYear]) {
                        const yearlyCounts = customersByBrandAndMonth[keyPrevYear]
                        cumulativeCustomers += yearlyCounts.reduce((sum, count) => sum + count, 0)
                    }
                }
                
                // Current year customers, accumulate month by month
                const currentYearKey = `${brandId}-${currentYear}`
                const currentYearCounts = customersByBrandAndMonth[currentYearKey] || Array(12).fill(0)
                
                for (let month = 1; month <= currentMonth; month++) {
                    // Add this month's new customers
                    cumulativeCustomers += currentYearCounts[month - 1]
                    
                    // Update all branch data for this brand/month
                    const brandBranches = branchesByBrand[brandId] || []
                    brandBranches.forEach(branch => {
                        const branchKey = `${branch.id}-${month}-${currentYear}`
                        const branchData = branchDataMap.get(branchKey)
                        if (branchData) {
                            branchData.total_customers = cumulativeCustomers
                        }
                    })
                    
                    // Update brand data
                    const brandKey = `${brandId}-${month}-${currentYear}`
                    const brandData = brandDataMap.get(brandKey)
                    if (brandData) {
                        brandData.total_customers = cumulativeCustomers
                    }
                }
            })
            
            // 9. Format the final response
            // Group branch data by brand and sort by month
            const formattedResponse = {
                sale_report: []
            }
            
            // Group branch data by brand
            const branchDataByBrand = Array.from(branchDataMap.values()).reduce((acc, branchData) => {
                if (!acc[branchData.brand_id]) {
                    acc[branchData.brand_id] = []
                }
                acc[branchData.brand_id].push(branchData)
                return acc
            }, {})
            
            // Create the final format
            Object.keys(branchDataByBrand).forEach(brandId => {
                const brandEntries = Array.from(brandDataMap.values()).filter(entry => entry.brand_id === brandId)
                const brandEntry = brandEntries.length > 0 ? brandEntries[0] : null
                
                if (brandEntry) {
                    const brandReport = {
                        brand_id: brandId,
                        brand_name: brandEntry.brand_name,
                        branch_data: branchDataByBrand[brandId].sort((a, b) => {
                            // Sort by year and month
                            if (a.year !== b.year) return b.year - a.year
                            return b.month - a.month
                        }),
                        brand_data: brandEntries.sort((a, b) => {
                            // Sort by year and month
                            if (a.year !== b.year) return b.year - a.year
                            return b.month - a.month
                        })
                    }
                    
                    formattedResponse.sale_report.push(brandReport)
                }
            })
            
            res.status(200).json(formattedResponse)
        } catch (error) {
            next(error)
        }
    }

    // [POST] /sale_report
    async createASaleReport() {
        try {
            // Get all orders to process
            const ordersQuery = 'SELECT * FROM "order"';
            const orders = await pool.query(ordersQuery);

            // Get all brands
            const brandsQuery = 'SELECT id FROM brand';
            const brands = await pool.query(brandsQuery);
            
            if (brands.rows.length === 0) {
                console.log("No brands found to generate reports");
                return;
            }

            // Get all branches - with their brand_id for reference
            const branchesQuery = 'SELECT id, brand_id, address FROM branch';
            const branches = await pool.query(branchesQuery);
            
            // Create a mapping of branch_id to brand_id for easy lookup
            const branchToBrandMap = {};
            branches.rows.forEach(branch => {
                branchToBrandMap[branch.id] = branch.brand_id;
            });

            // Get customers with their registration dates
            const customersQuery = `
                SELECT c.id, c.brand_id, mi.date_added 
                FROM customer c
                JOIN member_information mi ON c.member_information_id = mi.id
                ORDER BY mi.date_added ASC;
            `;
            const customersResult = await pool.query(customersQuery);
            
            // Group customers by brand and month/year of registration
            const customersByBrandAndMonth = {};
            
            customersResult.rows.forEach(customer => {
                const registrationDate = new Date(customer.date_added);
                const month = registrationDate.getMonth() + 1;
                const year = registrationDate.getFullYear();
                const brandId = customer.brand_id;
                
                const key = `${brandId}-${year}`;
                if (!customersByBrandAndMonth[key]) {
                    customersByBrandAndMonth[key] = Array(12).fill(0);
                }
                
                // Increment count for this month (0-indexed array)
                customersByBrandAndMonth[key][month - 1]++;
            });

            // Get branch-specific staff
            const branchStaffQuery = 'SELECT branch_id, COUNT(*) as staff_count FROM staff GROUP BY branch_id';
            const branchStaff = await pool.query(branchStaffQuery);
            const staffByBranch = branchStaff.rows.reduce((acc, row) => {
                acc[row.branch_id] = parseInt(row.staff_count);
                return acc;
            }, {});

            // Group orders by branch and month/year
            const branchReportGroups = {};
            const brandReportGroups = {};

            // Get current date for determining months to include
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
            const currentYear = currentDate.getFullYear();

            // Process orders - ONLY include completed orders for revenue calculation
            for (const order of orders.rows) {
                const orderDate = new Date(order.date_added);
                const month = orderDate.getMonth() + 1;
                const year = orderDate.getFullYear();
                const branchId = order.branch_id;
                
                // Get brand_id from the branch
                const brandId = branchToBrandMap[branchId];

                if (!brandId || !branchId) {
                    console.warn(`Skipping order ${order.id} due to missing brand_id or branch_id`);
                    continue;
                }

                // Check if order is completed - only include completed orders
                const isCompleted = order.status === 'Completed';
                if (!isCompleted) {
                    continue; // Skip non-completed orders
                }

                // Calculate revenue from the order
                let orderRevenue = 0;
                try {
                    const cart = typeof order.cart === 'string' ? JSON.parse(order.cart) : order.cart;
                    orderRevenue = cart.total_price || 0;
                } catch (e) {
                    console.error(`Error processing order ${order.id}:`, e);
                    continue;
                }

                // Create unique key for each branch-month-year combination
                const branchKey = `${branchId}-${month}-${year}`;

                if (!branchReportGroups[branchKey]) {
                    branchReportGroups[branchKey] = {
                        branchId,
                        brandId,
                        month,
                        year,
                        totalOrders: 0,
                        totalRevenue: 0,
                        totalCustomers: 0 // Will be calculated later
                    };
                }

                // Add the order to this branch's data
                branchReportGroups[branchKey].totalOrders++;
                branchReportGroups[branchKey].totalRevenue += orderRevenue;

                // Also update brand-level aggregated data
                const brandKey = `${brandId}-${month}-${year}`;
                
                if (!brandReportGroups[brandKey]) {
                    brandReportGroups[brandKey] = {
                        brandId,
                        month,
                        year,
                        totalOrders: 0,
                        totalRevenue: 0,
                        totalStaffs: 0,
                        totalCustomers: 0 // Will be calculated later
                    };
                }
                
                brandReportGroups[brandKey].totalOrders++;
                brandReportGroups[brandKey].totalRevenue += orderRevenue;
            }

            // Ensure all brands have entries for all branches and months
            // Even if a branch has no orders in a month, we want to show zero
            for (const brand of brands.rows) {
                const brandId = brand.id;
                
                // Get branches for this brand
                const brandBranches = branches.rows.filter(b => b.brand_id === brandId);
                
                // Calculate total staff for this brand
                let totalBrandStaff = 0;
                brandBranches.forEach(branch => {
                    totalBrandStaff += staffByBranch[branch.id] || 0;
                });
                
                // For each branch, ensure we have entries for all months
                for (const branch of brandBranches) {
                    const branchId = branch.id;
                    
                    // Create entries for all months from January to current month
                    for (let month = 1; month <= currentMonth; month++) {
                        const branchKey = `${branchId}-${month}-${currentYear}`;
                        
                        // If we don't have an entry for this branch-month combination, create one with zero values
                        if (!branchReportGroups[branchKey]) {
                            branchReportGroups[branchKey] = {
                                branchId,
                                brandId,
                                month,
                                year: currentYear,
                                totalOrders: 0,
                                totalRevenue: 0,
                                totalCustomers: 0 // Will be calculated later
                            };
                        }
                        
                        // Also ensure brand-level entries exist for all months
                        const brandKey = `${brandId}-${month}-${currentYear}`;
                        if (!brandReportGroups[brandKey]) {
                            brandReportGroups[brandKey] = {
                                brandId,
                                month,
                                year: currentYear,
                                totalOrders: 0,
                                totalRevenue: 0,
                                totalStaffs: totalBrandStaff,
                                totalCustomers: 0 // Will be calculated later
                            };
                        } else {
                            // Make sure totalStaffs is set
                            brandReportGroups[brandKey].totalStaffs = totalBrandStaff;
                        }
                    }
                }
            }
            
            // Calculate cumulative customer counts for each brand/month
            for (const brand of brands.rows) {
                const brandId = brand.id;
                let cumulativeCustomers = 0;
                
                // Get any customers from previous years
                for (let y = 2020; y < currentYear; y++) { // Assuming your business started in 2020 or later
                    const keyPrevYear = `${brandId}-${y}`;
                    if (customersByBrandAndMonth[keyPrevYear]) {
                        const yearlyCounts = customersByBrandAndMonth[keyPrevYear];
                        cumulativeCustomers += yearlyCounts.reduce((sum, count) => sum + count, 0);
                    }
                }
                
                // Current year customers, accumulate month by month
                const currentYearKey = `${brandId}-${currentYear}`;
                const currentYearCounts = customersByBrandAndMonth[currentYearKey] || Array(12).fill(0);
                
                for (let month = 1; month <= currentMonth; month++) {
                    // Add this month's new customers
                    cumulativeCustomers += currentYearCounts[month - 1];
                    
                    // Update all branch reports for this brand/month
                    const brandBranches = branches.rows.filter(b => b.brand_id === brandId);
                    brandBranches.forEach(branch => {
                        const branchKey = `${branch.id}-${month}-${currentYear}`;
                        if (branchReportGroups[branchKey]) {
                            branchReportGroups[branchKey].totalCustomers = cumulativeCustomers;
                        }
                    });
                    
                    // Update brand report
                    const brandKey = `${brandId}-${month}-${currentYear}`;
                    if (brandReportGroups[brandKey]) {
                        brandReportGroups[brandKey].totalCustomers = cumulativeCustomers;
                    }
                }
            }

            // Process and save brand-level reports
            const results = {
                created: [],
                updated: []
            };

            // Save brand-level reports to the database
            for (const key in brandReportGroups) {
                const group = brandReportGroups[key];
                
                // Check if brand-level report already exists
                const existingBrandReport = await pool.query(
                    'SELECT * FROM sale_report WHERE month = $1 AND year = $2 AND brand_id = $3',
                    [group.month, group.year, group.brandId]
                );

                if (existingBrandReport.rows.length > 0) {
                    // Update existing brand-level report
                    const updated = await pool.query(
                        `UPDATE sale_report 
                        SET total_revenue = $1, 
                            total_orders = $2, 
                            total_staffs = $3, 
                            total_customers = $4, 
                            date_added = CURRENT_TIMESTAMP
                        WHERE id = $5
                        RETURNING *`,
                        [
                            group.totalRevenue, 
                            group.totalOrders, 
                            group.totalStaffs, 
                            group.totalCustomers, 
                            existingBrandReport.rows[0].id
                        ]
                    );

                    results.updated.push(updated.rows[0]);
                } else {
                    // Create new brand-level report
                    const created = await pool.query(
                        `INSERT INTO sale_report
                        (brand_id, total_revenue, total_orders, total_staffs, total_customers, month, year)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        RETURNING *`,
                        [
                            group.brandId,
                            group.totalRevenue, 
                            group.totalOrders, 
                            group.totalStaffs, 
                            group.totalCustomers, 
                            group.month, 
                            group.year
                        ]
                    );

                    results.created.push(created.rows[0]);
                }
            }

            console.log(`Sale reports processed: ${results.created.length} created, ${results.updated.length} updated`);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = new SaleReportController