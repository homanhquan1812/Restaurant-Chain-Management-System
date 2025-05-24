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

// Mock the db module directly
jest.mock('../config/db', () => {
  return {
    pool: {
      query: jest.fn()
    }
  };
});

describe('OrderController - combineOrders', () => {
  let req, res, next;
  let mockPool;
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
    
    // Get reference to mocked pool - this will be the remote pool created with the env var
    mockPool = new Pool();
    
    // Import the real pool for mocking - this is the local pool
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

    // Mock remote database queries
    mockPool.query.mockImplementation((query) => {
      if (query.includes('SELECT * FROM "order"')) {
        return Promise.resolve({ rows: mockOrders });
      }
      return Promise.resolve({ rows: [] });
    });

    // Mock local database queries
    dbPool.query.mockImplementation((query) => {
      if (query.includes('SELECT id FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });

    // Act
    await OrderController.combineOrders(req, res, next);

    // Assert
    // 1. Check database connection
    expect(mockPool.connect).toHaveBeenCalled();
    
    // 2. Verify order updates
    const updateCalls = mockPool.query.mock.calls.filter(call => 
      call[0].includes('UPDATE "order"')
    );
    expect(updateCalls.length).toBe(1);
    
    // 3. Verify deleted orders (only order #2 should be deleted)
    const deleteCalls = mockPool.query.mock.calls.filter(call => 
      call[0].includes('DELETE FROM "order"')
    );
    expect(deleteCalls.length).toBe(1);
    expect(deleteCalls[0][1][0]).toEqual(["2"]);
    
    // 4. Check the combined cart data
    const combinedCart = JSON.parse(updateCalls[0][1][0]);
    expect(combinedCart.total_price).toBe(78000); // 43000 + 35000
    expect(combinedCart.items.length).toBe(3); // 2 items from first order + 1 from second
    
    // 5. Verify API response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Orders combined and synchronized successfully in both databases",
      combined_count: 1
    });
    
    // 6. Verify database connection was closed
    expect(mockPool.end).toHaveBeenCalled();
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

    // Mock remote database queries
    mockPool.query.mockImplementation((query) => {
      if (query.includes('SELECT * FROM "order"')) {
        return Promise.resolve({ rows: mockOrders });
      }
      return Promise.resolve({ rows: [] });
    });

    // Mock local database queries
    dbPool.query.mockImplementation((query) => {
      if (query.includes('SELECT id FROM "order"')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });

    // Act
    await OrderController.combineOrders(req, res, next);

    // Assert
    // 1. Check database connection
    expect(mockPool.connect).toHaveBeenCalled();
    
    // 2. Verify no order updates occurred
    const updateCalls = mockPool.query.mock.calls.filter(call => 
      call[0].includes('UPDATE "order"')
    );
    expect(updateCalls.length).toBe(0);
    
    // 3. Verify no orders were deleted
    const deleteCalls = mockPool.query.mock.calls.filter(call => 
      call[0].includes('DELETE FROM "order"')
    );
    expect(deleteCalls.length).toBe(0);
    
    // 4. Verify API response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Orders combined and synchronized successfully in both databases",
      combined_count: 0
    });
    
    // 5. Verify database connection was closed
    expect(mockPool.end).toHaveBeenCalled();
  });
});