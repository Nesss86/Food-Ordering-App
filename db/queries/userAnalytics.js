const db = require('../connection');

// Queries for user analytics
const getTopCustomers = () => {
  return db.query(`
    SELECT c.name AS customer_name, COALESCE(SUM(o.total_price), 0) AS total_spent
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    WHERE o.confirmed = TRUE
    GROUP BY c.name
    ORDER BY total_spent DESC
    LIMIT 5;
  `).then((res) => res.rows);
};

const getEngagementTrends = () => {
  return db.query(`
    SELECT DATE_TRUNC('month', time_placed) AS month, COUNT(*) AS orders_count
    FROM orders
    WHERE confirmed = TRUE
    GROUP BY month
    ORDER BY month;
  `).then((res) => res.rows);
};

const getBusinessGrowth = () => {
  return db.query(`
    SELECT DATE_TRUNC('month', time_placed) AS month, SUM(total_price) AS monthly_sales
    FROM orders
    WHERE confirmed = TRUE
    GROUP BY month
    ORDER BY month;
  `).then((res) => res.rows);
};

const getMostActiveUsers = () => {
  return db.query(`
    SELECT c.name AS customer_name, COUNT(o.id) AS orders_placed
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    WHERE o.confirmed = TRUE
    GROUP BY c.name
    ORDER BY orders_placed DESC
    LIMIT 5;
  `).then((res) => res.rows);
};

const getAverageOrderValue = () => {
  return db.query(`
    SELECT AVG(total_price) AS average_order_value
    FROM orders
    WHERE confirmed = TRUE;
  `).then((res) => res.rows[0]);
};

const getRepeatCustomers = () => {
  return db.query(`
    SELECT c.name AS customer_name, COUNT(o.id) AS orders_count
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE o.confirmed = TRUE
    GROUP BY c.name
    HAVING COUNT(o.id) > 1
    ORDER BY orders_count DESC;
  `).then((res) => res.rows);
};

// Export all functions
module.exports = {
  getTopCustomers,
  getEngagementTrends,
  getBusinessGrowth,
  getMostActiveUsers,
  getAverageOrderValue,
  getRepeatCustomers,
};

