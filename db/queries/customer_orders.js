const db = require('../connection');

// Function to retrieve single order by Id for customer
const getOrderById = (orderId) => {
  return db.query(
    `
    SELECT
      orders.id AS order_id,
      customers.name AS customer_name,
      food_items.name AS food_name,
      order_items.quantity,
      orders.time_placed,
      orders.time_ready,
      orders.order_status,
      orders.total_price
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
    JOIN order_items ON orders.id = order_items.order_id
    JOIN food_items ON order_items.food_id = food_items.id
    WHERE orders.id = $1;
    `,
    [orderId]
  ).then((res) => res.rows);
};

const addOrder = (order, items) => {

  const { customer_id, time_placed, order_status, total_price } = order;

  // Ensure the sequence is in sync with the current orders in the database
  const checkAndFixSequence = () => {
    return db.query('SELECT setval(\'orders_id_seq\', (SELECT COALESCE(MAX(id), 0) FROM orders));');
  };

  // Check if the order already exists
  const checkExistingOrder = (customerId, timePlaced, orderStatus) => {
    return db.query(
      `SELECT id FROM orders WHERE customer_id = $1 AND time_placed = $2 AND order_status = $3 LIMIT 1;`,
      [customerId, timePlaced, orderStatus]
    );
  };

  // Ensure sequence is fixed before inserting
  return checkAndFixSequence()
    .then(() => checkExistingOrder(customer_id, time_placed, order_status))
    .then((existingOrderResult) => {
      if (existingOrderResult.rows.length > 0) {
        console.log('Order already exists, skipping insertion.');
        return existingOrderResult.rows[0].id;
      }

      // inserting the order into the "Orders" table
      return db.query(
        `INSERT INTO orders (customer_id, time_placed, order_status, total_price)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`,
        [customer_id, time_placed, order_status, total_price]
      );
    })
    .then((orderResult) => {
      const orderId = orderResult.rows[0].id;
      console.log(`Inserted order ID: ${orderId}`);

      // Prepare the query for inserting items into "Order_Items"
      const itemInsertPromises = items.map((item) => {
        const foodId = parseInt(item.food_id, 10); // Convert to integer
        const quantity = item.quantity;
      
        return db.query(
          `INSERT INTO order_items (order_id, food_id, quantity)
           VALUES ($1, $2, $3);`,
          [orderId, foodId, quantity]
        ).catch((err) => {
          console.error(`Error inserting item ${JSON.stringify(item)}:`, err.message);
          throw err;
        });
      });

      // Execute all item insert queries
      return Promise.all(itemInsertPromises).then(() => orderId);
    })
    .catch((err) => {
      console.error("SQL Error in addOrder:", err.stack || err.message);
      throw err;
    });
};


module.exports = { getOrderById, addOrder };



