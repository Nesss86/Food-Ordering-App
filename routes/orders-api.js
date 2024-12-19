const express = require('express');
const router = express.Router();
const ordersQueries = require('../db/queries/admin_orders'); // Correctly import the queries
const createMessage = require('../sms');

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
  const { status, ready_at } = req.body;

  // Validate status input
  if (!['approved', 'rejected'].includes(status.toLowerCase())) {
    console.error(`Invalid status: ${status}`);
    return res.status(400).json({ error: "Invalid status. Use 'approved' or 'rejected'." });
  }

  // Validate ready_at if status is approved
  if (status === 'approved' && (!ready_at || isNaN(parseInt(ready_at, 10)))) {
    console.log('Invalid ready_at time:', ready_at);
    return res.status(400).json({ error: "Invalid ready_at time. Please provide a valid number." });
  }

  ordersQueries.updateOrderStatus(id, status, ready_at)
    .then(updatedOrder => {
      if (status === 'approved') {
        createMessage(`Order ${updatedOrder.id} approved. Ready in ${ready_at || '15'} minutes.`)
          .then(() => console.log('Approval message sent successfully.'))
          .catch(err => console.error('Error sending approval message:', err));

        if (ready_at) {
          setTimeout(() => {
            createMessage(`Order ${updatedOrder.id} is now ready!`)
              .then(() => console.log('Ready notification sent successfully.'))
              .catch(err => console.error('Error sending ready notification:', err));
          }, parseInt(ready_at, 10) * 60 * 1000);
        }
      } else if (status === 'rejected') {
        createMessage(`Sorry but your order cannot be completed at this time, the staff is too lazy.`)
          .then(() => console.log('Rejection message sent successfully.'))
          .catch(err => console.error('Error sending rejection message:', err));
      }
      res.status(200).json({ message: `Order ${id} updated successfully to '${status}'.` });
    })
    .catch(err => {
      console.error(`Error updating order ${id}:`, err.message);
      res.status(500).json({ error: "Failed to update order status." });
    });
});

module.exports = router;








