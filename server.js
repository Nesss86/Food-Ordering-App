// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Middleware
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
const userApiRoutes = require('./routes/users-api');
const usersRoutes = require('./routes/users');
const dashboardApiRoutes = require('./routes/dashboard-api');
const inventoryApiRoutes = require('./routes/inventory-api');
const analyticsApiRoutes = require('./routes/analytics-api');
const menuPageRoutes = require('./routes/menu_page');
const orderRoutes = require('./routes/orders');

app.use('/api/users', userApiRoutes);
app.use('/users', usersRoutes);
app.use('/api/dashboard', dashboardApiRoutes);
app.use('/api/inventory', inventoryApiRoutes);
app.use('/api/analytics', analyticsApiRoutes);
app.use('/menu_page', menuPageRoutes);
app.use('/orders', orderRoutes);

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

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("Sorry, page not found.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});




