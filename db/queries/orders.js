const db = require('../connection');

const getOrders = () => {
  return db.query(`
    SELECT orders.id, customers.name AS customerName, food_items.name AS foodName, order_items.quantity
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
    JOIN order_items ON orders.id = order_items.order_id
    JOIN food_items ON order_items.food_id = food_items.id
    WHERE orders.order_status = 'pending'
    ORDER BY orders.id;
  `).then(res => res.rows);
};

const updateOrderStatus = (orderId, status) => {
  return db.query(`
    UPDATE orders
    SET order_status = $2
    WHERE id = $1;
  `, [orderId, status]);
};

const addOrder = (order) => {
 const {customer_id, time_placed, time_ready, order_status,
  total_price } = order;

  return db.query(
    `INSERT INTO Orders (customer_id, time_placed, time_ready, order_status,
  total_price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *;
     `, [customer_id, time_placed, time_ready, order_status,
      total_price])
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.error(err.message);
        throw err;
      });
};

module.exports = {
  getOrders,
  updateOrderStatus,
  addOrder
}
