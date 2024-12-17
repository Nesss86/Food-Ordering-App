// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

// Server configuration
const PORT = process.env.PORT || 8080;
const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);
app.use('/public', express.static(__dirname + '/public'));

// Routes
const ordersApiRoutes = require('./routes/orders-api');
const inventoryApiRoutes = require('./routes/inventory-api');
const analyticsApiRoutes = require('./routes/analytics-api');
const menuPageRoutes = require('./routes/menu_page');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Mount API routes
app.use('/api/orders', ordersApiRoutes);
app.use('/api/inventory', inventoryApiRoutes);
app.use('/api/analytics', analyticsApiRoutes);
app.use('/menu_page', menuPageRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/orders', (req, res) => {
  res.render('orders');
});

app.get('/admin', (req, res) => {
  res.redirect('/admin-dashboard');
});

app.get('/admin-dashboard', (req, res) => {
  res.render('admin_dashboard');
});

// 404 Error handler
app.use((req, res) => res.status(404).send("Sorry, page not found."));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






