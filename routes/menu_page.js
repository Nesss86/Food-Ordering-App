const express = require('express');
const router  = express.Router();
const db = require('../db/connection');
const getAllMenuItems = require('../db/queries/menu_page');

// route for displaying all menu items on the menu_page
router.get('/', (req,res) => {
  const user_id = req.session.user_id

  if (!user_id) {
    return res.send({ error: "must be logged in to use this service" });
  }

  db.getAllMenuItems()
  .then((menuItems) => res.send({ menuItems }))
  .catch((e) => {
    console.error(e);
    res.send(e);
  });
});

module.exports = router;
