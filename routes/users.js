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
app.get('/login/:id', (req, res) => {
  // using encrypted cookies
  req.session.user_id = req.params.id;
  // send the user somewhere
  res.redirect('/');
});

// Route for logout
router.post('/logout', (req, res) => {
  req.session = null;
  res.send({});
});


module.exports = router;
