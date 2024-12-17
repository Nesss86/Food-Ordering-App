const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.redirect('/admin-dashboard');
});

// to be changed to admin/dashboard
router.get('/dashboard', (req, res) => {
  res.render('admin_dashboard');
});

module.exports = router;
