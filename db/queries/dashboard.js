const db = require('../connection');

// Query to get total sales
const getTotalSales = () => {
  return db.query(`
    SELECT COALESCE(SUM(total_price), 0) AS total_sales
    FROM orders
    WHERE confirmed = TRUE;
  `)
  .then((res) => res.rows[0])
  .catch((err) => {
    console.error('Error in getTotalSales:', err.message);
    throw err;
  });
};

// Query to get total orders
const getTotalOrders = () => {
  return db.query(`
    SELECT COUNT(*) AS total_orders
    FROM orders
    WHERE confirmed = TRUE;
  `)
  .then((res) => res.rows[0])
  .catch((err) => {
    console.error('Error in getTotalOrders:', err.message);
    throw err;
  });
};

// Query to get active users
const getActiveUsers = () => {
  return db.query(`
    SELECT COUNT(DISTINCT customer_id) AS active_users
    FROM orders
    WHERE time_placed >= NOW() - INTERVAL '30 days';
  `)
  .then((res) => res.rows[0])
  .catch((err) => {
    console.error('Error in getActiveUsers:', err.message);
    throw err;
  });
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
  `)
  .then((res) => res.rows[0])
  .catch((err) => {
    console.error('Error in getMostSoldItem:', err.message);
    throw err;
  });
};

// Query to get recent activity
const getRecentActivity = () => {
  return db.query(`
    SELECT orders.id AS order_id, customers.name AS customer_name, food_items.name AS item_name, orders.order_status
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
    JOIN order_items ON order_items.order_id = orders.id
    JOIN food_items ON order_items.food_id = food_items.id
    ORDER BY orders.time_placed DESC
    LIMIT 5;
  `)
  .then((res) => res.rows)
  .catch((err) => {
    console.error('Error in getRecentActivity:', err.message);
    throw err;
  });
};

// Consolidated query for all metrics
const getDashboardMetrics = () => {
  return Promise.all([
    getTotalSales(),
    getTotalOrders(),
    getActiveUsers(),
    getMostSoldItem()
  ]).then(([totalSales, totalOrders, activeUsers, mostSoldItem]) => ({
    totalSales,
    totalOrders,
    activeUsers,
    mostSoldItem
  })).catch((err) => {
    console.error('Error in getDashboardMetrics:', err.message);
    throw err;
  });
};

// Export all queries as functions
module.exports = {
  getTotalSales,
  getTotalOrders,
  getActiveUsers,
  getMostSoldItem,
  getRecentActivity,
  getDashboardMetrics
};


