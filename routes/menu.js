const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection (Reuse existing connection setup)
const db = new Pool({
  user: process.env.DB_USER || 'labber',
  password: process.env.DB_PASS || 'labber',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'midterm',
  port: process.env.DB_PORT || 5432
});

// /menu Route
router.get('/', (req, res) => {
  const query = `
    SELECT id, name, price, image_path, category
    FROM food_items
    WHERE is_available = TRUE;
  `;

  db.query(query)
    .then(result => {
      const foodItems = result.rows.reduce((acc, item) => {
        item.price = parseFloat(item.price); // Ensure price is a float
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {});
      res.render('menu', { foodItems, user_id: req.session.user_id }); // Pass food items to EJS template
    })
    .catch(err => {
      console.error("Error fetching menu items:", err.message);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
