const db = require('../connection');

const getUserById = (id) => {
  return db.query(`
    SELECT id, name, email, phone_number, signup_date
    FROM customers
    WHERE id = $1;
  `, [id]).then((res) => res.rows[0]);
};

const getUserByEmail = (email) => {
  return db.query(`
    SELECT id, name, email, password
    FROM customers
    WHERE email = $1;
  `, [email]).then((res) => res.rows[0]);
};

const emailExists = (email) => {
  return db.query(`
    SELECT COUNT(*) AS count
    FROM customers
    WHERE email = $1;
  `, [email]).then((res) => parseInt(res.rows[0].count, 10) > 0);
};

const addNewUser = (name, email, password, phoneNumber) => {
  return db.query(`
    INSERT INTO customers (name, email, password, phone_number)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [name, email, password, phoneNumber]).then((res) => res.rows[0]);
};

const updateUser = (id, name, email, phoneNumber) => {
  return db.query(`
    UPDATE customers
    SET name = $1, email = $2, phone_number = $3
    WHERE id = $4
    RETURNING *;
  `, [name, email, phoneNumber, id]).then((res) => res.rows[0]);
};

const deleteUser = (id) => {
  return db.query(`
    DELETE FROM customers
    WHERE id = $1
    RETURNING *;
  `, [id]).then((res) => res.rows[0]);
};

const getAllUsers = () => {
  return db.query(`
    SELECT id, name, email, phone_number, signup_date
    FROM customers
    ORDER BY signup_date DESC;
  `).then((res) => res.rows);
};

module.exports = {
  getUserById,
  getUserByEmail,
  emailExists,
  addNewUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
