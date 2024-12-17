// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const morgan = require('morgan');

// Server configuration
const PORT = process.env.PORT || 8080;
const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve static files from the "public" folder

// Routes
const ordersApiRoutes = require('./routes/orders-api');
const inventoryApiRoutes = require('./routes/inventory-api');

// Mount API routes
app.use('/api/orders', ordersApiRoutes);
app.use('/api/inventory', inventoryApiRoutes);

// View routes
app.get('/', (req, res) => res.render('index'));
app.get('/admin-dashboard', (req, res) => res.render('admin_dashboard'));

// 404 Error handler
app.use((req, res) => res.status(404).send("Sorry, page not found."));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






