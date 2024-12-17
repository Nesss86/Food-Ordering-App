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

module.exports = { getOrderById };



