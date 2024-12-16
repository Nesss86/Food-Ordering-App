/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  userQueries.getAllUsers()
    .then(users => res.json({ users }))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  userQueries.addNewUser(name, email, password, phoneNumber)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
