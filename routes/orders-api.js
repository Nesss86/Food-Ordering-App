const express = require('express');
const router = express.Router();
const ordersQueries = require('../db/queries/customer_orders'); // Correctly import the queries

// Fetch Pending Orders (limit to 5 for Manage Orders)
router.get('/', (req, res) => {
  ordersQueries
    .getOrders()
    .then(orders => res.json({ orders: orders.slice(0, 5) })) // Limit to 5 orders
    .catch(err => res.status(500).json({ error: err.message }));
});

// Fetch All Orders for Order History
router.get('/history', (req, res) => {
  const { search } = req.query;
  ordersQueries
    .getOrderHistory(search)
    .then(data => res.json({ history: data })) // No limit here, fetch all
    .catch(err => res.status(500).json({ error: err.message }));
});

// Update Order Status (Approve or Reject)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  ordersQueries
    .updateOrderStatus(id, status)
    .then(() => res.status(200).json({ message: `Order ${id} updated to ${status}` }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;






