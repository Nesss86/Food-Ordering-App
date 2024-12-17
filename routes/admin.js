const express = require('express');
const router  = express.Router();

app.get('/', (req, res) => {
  res.redirect('/admin-dashboard');
});

// to be changed to admin/dashboard
app.get('/dashboard', (req, res) => {
  res.render('admin_dashboard');
});

module.exports = router;
