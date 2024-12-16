const db = require('../connection');

const getLowStockItems = () => {
  return db.query(`
    SELECT id, name, category, is_available
    FROM food_items
    WHERE is_available = FALSE
    ORDER BY id;
  `).then((res) => res.rows);
};

const getMostPopularItems = () => {
  return db.query(`
    SELECT fi.name AS item_name, COUNT(oi.id) AS total_orders
    FROM order_items oi
    JOIN food_items fi ON oi.food_id = fi.id
    GROUP BY fi.name
    ORDER BY total_orders DESC
    LIMIT 5;
  `).then((res) => res.rows);
};

const getItemsInStock = () => {
  return db.query(`
    SELECT id, name, category, is_available
    FROM food_items
    WHERE is_available = TRUE
    ORDER BY category, name;
  `).then((res) => res.rows);
};

const getRestockRecommendations = () => {
  return db.query(`
    SELECT id, name, category
    FROM food_items
    WHERE is_available = FALSE
    ORDER BY category, name;
  `).then((res) => res.rows);
};

const getTotalInventoryValue = () => {
  return db.query(`
    SELECT SUM(price) AS total_value
    FROM food_items
    WHERE is_available = TRUE;
  `).then((res) => res.rows[0]);
};

// Export all functions
module.exports = {
  getLowStockItems,
  getMostPopularItems,
  getItemsInStock,
  getRestockRecommendations,
  getTotalInventoryValue,
};

