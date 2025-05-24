const { Pool } = require('pg');
const OrderController = require('../src/app/controller/OrderController');

// Mock the dependencies
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock the db module directly - this is the pool used in the actual implementation
jest.mock('../config/db', () => {
  return {
    pool: {
      query: jest.fn()
    }
  };
});

// Mock node-cron to prevent cron jobs from running during tests
jest.mock('node-cron', () => ({
  schedule: jest.fn()
}));

describe('OrderController - combineOrders', () => {
  let req, res, next;
  let dbPool;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response and next function
    req = {
      body: {
        rcms_id: 'test-rcms-id'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Import the mocked pool - this is what the actual implementation uses
    dbPool = require('../config/db').pool;
  });

  test('should combine orders within 5 minutes and calculate correct total price', async () => {
    // Arrange
    const mockOrders = [
      {
        id: "1",
        customer_id: "customer1",
        branch_id: "branch1",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item1",
              name: "Baguette Salad",
              price: 18000,
              quantity: 1,
              total_price: 18000
            },
            {
              id: "item2",
              name: "Sesame Baguette Salad",
              price: 25000,
              quantity: 1,
              total_price: 25000
            }
          ],
          total_price: 43000
        },
        date_added: "2025-05-08T13:58:02.196Z"
      },
      {
        id: "2",
        customer_id: "customer1", // Same customer
        branch_id: "branch2",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item3",
              name: "Sausage Bun",
              price: 35000,
              quantity: 1,
              total_price: 35000
            }
          ],
          total_price: 35000
        },
        date_added: "2025-05-08T13:58:12.321Z" // Within 5 minutes of the first order
      },
      {
        id: "3",
        customer_id: "customer1", // Same customer
        branch_id: "branch3",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item4",
              name: "Cheesy Pork Floss",
              price: 40000,
              quantity: 1,
              total_price: 40000
            }
          ],
          total_price: 40000
        },
        date_added: "2025-05-08T13:58:25.365Z" // Also within 5 minutes of the second order
      }
    ];

    // Mock database queries - the implementation uses dbPool.query for all operations
    dbPool.query.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM "order"')) {
        return Promise.resolve({ rows: mockOrders });
      }
      if (query.includes('SELECT id FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('UPDATE "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('DELETE FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('INSERT INTO "order"')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });

    // Act
    await OrderController.combineOrders(req, res, next);

    // Assert
    // 1. Verify initial order fetch
    const selectCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('SELECT * FROM "order"')
    );
    expect(selectCalls.length).toBe(1);
    
    // 2. Verify order updates (should update the first order with combined cart)
    const updateCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('UPDATE "order"') && call[0].includes('SET cart')
    );
    expect(updateCalls.length).toBe(1);
    
    // 3. Verify deleted orders (order #2 should be deleted since it was combined into order #1)
    const deleteCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('DELETE FROM "order"') && call[0].includes('ANY($1)')
    );
    expect(deleteCalls.length).toBe(1);
    expect(deleteCalls[0][1][0]).toContain("2");
    
    // 4. Check the combined cart data
    const combinedCartString = updateCalls[0][1][0];
    const combinedCart = JSON.parse(combinedCartString);
    expect(combinedCart.total_price).toBe(78000); // 43000 + 35000 (only first two orders should be combined)
    expect(combinedCart.items.length).toBe(3); // 2 items from first order + 1 from second
    
    // 5. Verify RCMS database sync operations
    const insertCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('INSERT INTO "order"')
    );
    // Should insert/update the remaining orders (after combination)
    expect(insertCalls.length).toBeGreaterThan(0);
  });

  test('should not combine orders that are more than 5 minutes apart', async () => {
    // Arrange
    const mockOrders = [
      {
        id: "1",
        customer_id: "customer1",
        branch_id: "branch1",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item1",
              name: "Baguette Salad",
              price: 18000,
              quantity: 1,
              total_price: 18000
            }
          ],
          total_price: 18000
        },
        date_added: "2025-05-08T13:58:02.196Z"
      },
      {
        id: "2",
        customer_id: "customer1", // Same customer
        branch_id: "branch2",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item2",
              name: "Sausage Bun",
              price: 35000,
              quantity: 1,
              total_price: 35000
            }
          ],
          total_price: 35000
        },
        date_added: "2025-05-08T14:04:12.321Z" // More than 5 minutes after the first order
      }
    ];

    // Mock database queries
    dbPool.query.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM "order"')) {
        return Promise.resolve({ rows: mockOrders });
      }
      if (query.includes('SELECT id FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('INSERT INTO "order"')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });

    // Act
    await OrderController.combineOrders(req, res, next);

    // Assert
    // 1. Verify initial order fetch
    const selectCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('SELECT * FROM "order"')
    );
    expect(selectCalls.length).toBe(1);
    
    // 2. Verify no order combination updates occurred
    const updateCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('UPDATE "order"') && call[0].includes('SET cart')
    );
    expect(updateCalls.length).toBe(0);
    
    // 3. Verify no orders were deleted from combination
    const deleteCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('DELETE FROM "order"') && call[0].includes('ANY($1)')
    );
    // There might be delete calls for RCMS sync, but not for order combination
    const combinationDeleteCalls = deleteCalls.filter(call => 
      Array.isArray(call[1][0]) && call[1][0].length > 0
    );
    expect(combinationDeleteCalls.length).toBe(0);
    
    // 4. Verify RCMS database sync still occurred
    const insertCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('INSERT INTO "order"')
    );
    expect(insertCalls.length).toBeGreaterThan(0);
  });

  test('should combine orders with same items correctly', async () => {
    // Arrange
    const mockOrders = [
      {
        id: "1",
        customer_id: "customer1",
        branch_id: "branch1",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item1",
              name: "Baguette Salad",
              price: 18000,
              quantity: 2,
              total_price: 36000
            }
          ],
          total_price: 36000
        },
        date_added: "2025-05-08T13:58:02.196Z"
      },
      {
        id: "2",
        customer_id: "customer1",
        branch_id: "branch2",
        status: "Processing",
        payment_method: "Cash",
        cart: {
          items: [
            {
              id: "item1", // Same item as in first order
              name: "Baguette Salad",
              price: 18000,
              quantity: 1,
              total_price: 18000
            }
          ],
          total_price: 18000
        },
        date_added: "2025-05-08T13:59:02.196Z" // Within 5 minutes
      }
    ];

    // Mock database queries
    dbPool.query.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM "order"')) {
        return Promise.resolve({ rows: mockOrders });
      }
      if (query.includes('SELECT id FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('UPDATE "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('DELETE FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      if (query.includes('INSERT INTO "order"')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });

    // Act
    await OrderController.combineOrders(req, res, next);

    // Assert
    const updateCalls = dbPool.query.mock.calls.filter(call => 
      call[0].includes('UPDATE "order"') && call[0].includes('SET cart')
    );
    expect(updateCalls.length).toBe(1);
    
    // Check that items with same ID were combined correctly
    const combinedCartString = updateCalls[0][1][0];
    const combinedCart = JSON.parse(combinedCartString);
    expect(combinedCart.items.length).toBe(1); // Should have only one item
    expect(combinedCart.items[0].quantity).toBe(3); // 2 + 1
    expect(combinedCart.items[0].total_price).toBe(54000); // 36000 + 18000
    expect(combinedCart.total_price).toBe(54000);
  });
});