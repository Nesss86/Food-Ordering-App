const db = require('../connection');

// Fetch low stock items
const getLowStockItems = () => {
  return db.query(`
    SELECT fi.id, fi.name, fi.category, COALESCE(SUM(oi.quantity), 0) AS total_quantity
    FROM food_items fi
    LEFT JOIN order_items oi ON fi.id = oi.food_id
    WHERE fi.is_available = TRUE
    GROUP BY fi.id, fi.name, fi.category
    HAVING COALESCE(SUM(oi.quantity), 0) < 10
    ORDER BY fi.category, fi.name;
  `).then((res) => res.rows);
};

// Fetch most popular items
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

// Fetch items currently in stock
const getItemsInStock = () => {
  return db.query(`
    SELECT fi.id, fi.name, fi.category, fi.is_available,
           COALESCE(SUM(oi.quantity), 0) AS total_quantity
    FROM food_items fi
    LEFT JOIN order_items oi ON fi.id = oi.food_id
    WHERE fi.is_available = TRUE
    GROUP BY fi.id, fi.name, fi.category, fi.is_available
    ORDER BY fi.category, fi.name;
  `).then((res) => res.rows);
};

// Fetch restock recommendations
const getRestockRecommendations = () => {
  return db.query(`
    SELECT fi.id, fi.name, fi.category, COALESCE(SUM(oi.quantity), 0) AS total_quantity
    FROM food_items fi
    LEFT JOIN order_items oi ON fi.id = oi.food_id
    WHERE fi.is_available = FALSE OR COALESCE(SUM(oi.quantity), 0) < 5
    GROUP BY fi.id, fi.name, fi.category
    ORDER BY fi.category, fi.name;
  `).then((res) => res.rows);
};

// Calculate total inventory value
const getTotalInventoryValue = () => {
  return db.query(`
    SELECT SUM(fi.price * COALESCE(SUM(oi.quantity), 0)) AS total_value
    FROM food_items fi
    LEFT JOIN order_items oi ON fi.id = oi.food_id
    WHERE fi.is_available = TRUE
    GROUP BY fi.id;
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



