const db = require('../connection');

// Query to get total sales
const getTotalSales = () => {
  return db.query(`
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE confirmed = TRUE;
  `).then((res) => res.rows[0]);
};

// Query to get total orders
const getTotalOrders = () => {
  return db.query(`
    SELECT COUNT(*) AS total_orders
    FROM orders
    WHERE confirmed = TRUE;
  `).then((res) => res.rows[0]);
};

// Query to get active users
const getActiveUsers = () => {
  return db.query(`
    SELECT COUNT(DISTINCT customer_id) AS active_users
    FROM orders
    WHERE time_placed >= NOW() - INTERVAL '30 days';
  `).then((res) => res.rows[0]);
};

// Query to get the most sold item
const getMostSoldItem = () => {
  return db.query(`
    SELECT fi.name AS item_name, SUM(oi.quantity) AS total_sold
    FROM order_items oi
    JOIN food_items fi ON oi.food_id = fi.id
    GROUP BY fi.name
    ORDER BY total_sold DESC
    LIMIT 1;
  `).then((res) => res.rows[0]);
};

// Export all queries as functions
module.exports = {
  getTotalSales,
  getTotalOrders,
  getActiveUsers,
  getMostSoldItem
};

