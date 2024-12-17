// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { Pool } = require('pg');

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
const rootRoutes = require('./routes/root'); // New file for '/' route
const menuRoutes = require('./routes/menu'); // New file for '/menu' route

app.use('/api/orders', ordersApiRoutes);
app.use('/api/inventory', inventoryApiRoutes);
app.use('/menu_page', menuPageRoutes);
app.use('/customer_orders', customerOrderRoutes);
app.use('/admin_orders', adminOrderRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', rootRoutes); // Root route
app.use('/menu', menuRoutes); // Menu route

// 404 Error handler
app.use((req, res) => res.status(404).send("Sorry, page not found."));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});








