const express = require('express');
const router = express.Router();
const ordersQueries = require('../db/queries/admin_orders'); // Correctly import the queries

// Fetch Pending Orders (limit configurable via query param, default to 5)
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5; // Default limit to 5
  ordersQueries
    .getOrders()
    .then(orders => {
      const limitedOrders = orders.slice(0, limit);
      res.status(200).json({ orders: limitedOrders });
    })
    .catch(err => {
      console.error("Error fetching pending orders:", err.message);
      res.status(500).json({ error: "Failed to fetch pending orders." });
    });
});

// Fetch All Orders for Order History (optional search filter)
router.get('/history', (req, res) => {
  const { search } = req.query;
  ordersQueries
    .getOrderHistory(search)
    .then(history => {
      res.status(200).json({ history });
    })
    .catch(err => {
      console.error("Error fetching order history:", err.message);
      res.status(500).json({ error: "Failed to fetch order history." });
    });
});

// Update Order Status (Approve or Reject)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Log incoming data
  console.log(`PATCH Request - Order ID: ${id}, Status: ${status}`);

  // Validate status input
  if (!['approved', 'rejected'].includes(status.toLowerCase())) {
    console.error(`Invalid status: ${status}`);
    return res.status(400).json({ error: "Invalid status. Use 'approved' or 'rejected'." });
  }

  ordersQueries
    .updateOrderStatus(id, status.toLowerCase())
    .then(() => {
      res.status(200).json({ message: `Order ${id} successfully updated to '${status}'` });
    })
    .catch(err => {
      console.error(`Error updating order ${id}:`, err.message);
      res.status(500).json({ error: `Failed to update order ${id}.` });
    });
});

module.exports = router;








