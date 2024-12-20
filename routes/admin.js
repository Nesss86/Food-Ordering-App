const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// to be changed to admin/dashboard
router.get('/dashboard', (req, res) => {
  if(req.session.user_id !== '1'){
    res.redirect('/menu');
  }
  res.render('admin_dashboard');
});

module.exports = router;
