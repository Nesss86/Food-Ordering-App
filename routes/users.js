/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('users');
});

// Simplified route for logging in
router.get('/login/:id', (req, res) => {
  // using encrypted cookies
  req.session.user_id = req.params.id;
  // send the user somewhere
  res.redirect('/menu');
});

// Route for logout
router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});


module.exports = router;
