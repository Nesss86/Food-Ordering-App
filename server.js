// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { Pool } = require('pg'); // Add PG for database

// Server configuration
const PORT = process.env.PORT || 8080;
const app = express();

// Database connection
const db = new Pool({
  user: process.env.DB_USER || 'labber',
  password: process.env.DB_PASS || 'labber',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'midterm',
  port: process.env.DB_PORT || 5432
});

// Middleware setup
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);
app.use(express.static(__dirname + '/public'));

// Routes
const ordersApiRoutes = require('./routes/orders-api');
const inventoryApiRoutes = require('./routes/inventory-api');
const menuPageRoutes = require('./routes/menu_page');
const customerOrderRoutes = require('./routes/customer_orders');
const adminOrderRoutes = require('./routes/admin_orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/orders', ordersApiRoutes);
app.use('/api/inventory', inventoryApiRoutes);
app.use('/menu_page', menuPageRoutes);
app.use('/customer_orders', customerOrderRoutes);
app.use('/admin_orders', adminOrderRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.render('index');
});

// New /menu route
app.get('/menu', (req, res) => {
  const query = `
    SELECT id, name, price, image_path, category
    FROM food_items
    WHERE is_available = TRUE;
  `;

  db.query(query)
    .then(result => {
      const foodItems = result.rows.reduce((acc, item) => {
        // Ensure price is a float
        item.price = parseFloat(item.price);
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {});
      res.render('menu', { foodItems }); // Pass the food items to EJS
    })
    .catch(err => {
      console.error("Error fetching menu items:", err.message);
      res.status(500).send("Internal Server Error");
    });
});


// 404 Error handler
app.use((req, res) => res.status(404).send("Sorry, page not found."));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







