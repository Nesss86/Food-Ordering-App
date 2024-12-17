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
  const { customer_id, time_placed, time_ready, order_status, total_price } = order;

  // inserting the order into the "Orders" table
  return db.query(
    `INSERT INTO Orders (customer_id, time_placed, time_ready, order_status, total_price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ID;`,
    [customer_id, time_placed, time_ready, order_status, total_price]
  )
    .then((orderResult) => {
      const orderId = orderResult.rows[0].id;

      // Prepare the query for inserting items into "Order_Items"
      const itemInsertPromises = items.map((item) => {
        const { food_id, quantity } = item;

        return db.query(
          `INSERT INTO Order_Items (order_id, food_id, quantity)
           VALUES ($1, $2, $3);`,
          [orderId, food_id, quantity]
        );
      });

      // Execute all item insert queries
      return Promise.all(itemInsertPromises).then(() => orderId);
    })
    .then((orderId) => {
      console.log(`Order ${orderId} and all items added successfully.`);
      return { success: true, orderId };
    })
    .catch((err) => {
      console.error("Error adding order and items:", err.message);
      throw err;
    });
};


module.exports = { getOrderById, addOrder };



