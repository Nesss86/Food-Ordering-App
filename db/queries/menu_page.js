const db = require('../connection');

const getAllMenuItems = function() {
  return db.query(`SELECT * FROM Food_Items;`)
  .then((res) => res.rows);
};

module.exports = { 
  getAllMenuItems
};