const express = require('express');
const router = express.Router();
const adminOrderQueries = require('../db/queries/admin_orders');
const createMessage = require('../sms');

// Fetch all admin orders
router.get('/', (req, res) => {
  adminOrderQueries.getOrders()
    .then(orders => res.json({ orders }))
    .catch(err => {
      console.error("Error fetching orders:", err.message);
      res.status(500).json({ error: "Failed to fetch orders." });
    });
});

// Approve/Reject Order
router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const { status, ready_at } = req.body;

  // Validate status input
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Use 'approved' or 'rejected'." });
  }

  adminOrderQueries.updateOrderStatus(id, status, ready_at)
    .then(updatedOrder => {
      if (status === 'approved') {
        createMessage(`Order ${updatedOrder.id} approved. Ready in ${ready_at || '15'} minutes.`);

        if (ready_at) {
          setTimeout(() => {
            createMessage(`Order ${updatedOrder.id} is now ready!`);
          }, parseInt(ready_at, 10) * 60 * 1000);
        }
      } else if (status === 'rejected') {
        createMessage(`Order ${updatedOrder.id} was rejected.`);
      }
      res.status(200).json({ message: `Order ${id} updated successfully to '${status}'.` });
    })
    .catch(err => {
      console.error(`Error updating order ${id}:`, err.message);
      res.status(500).json({ error: "Failed to update order status." });
    });
});

module.exports = router;


