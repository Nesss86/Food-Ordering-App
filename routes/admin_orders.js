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

  console.log(`Received update request for order ${id}`);
  console.log('Request body:', req.body);

  // Validate status input
  if (!['approved', 'rejected'].includes(status)) {
    console.log('Invalid status:', status);
    return res.status(400).json({ error: "Invalid status. Use 'approved' or 'rejected'." });
  }

  // Validate ready_at if status is approved
  if (status === 'approved' && (!ready_at || isNaN(parseInt(ready_at, 10)))) {
    console.log('Invalid ready_at time:', ready_at);
    return res.status(400).json({ error: "Invalid ready_at time. Please provide a valid number." });
  }

  adminOrderQueries.updateOrderStatus(id, status, ready_at)
    .then(updatedOrder => {
      console.log('Order status updated:', updatedOrder);
      if (status === 'approved') {
        console.log(`Preparing to send approval message for order ${updatedOrder.id}`);
        createMessage(`Order ${updatedOrder.id} approved. Ready in ${ready_at || '15'} minutes.`)
          .then(() => console.log('Approval message sent successfully.'))
          .catch(err => console.error('Error sending approval message:', err));

        if (ready_at) {
          console.log(`Scheduling ready message for order ${updatedOrder.id} in ${ready_at} minutes`);
          setTimeout(() => {
            createMessage(`Order ${updatedOrder.id} is now ready!`)
              .then(() => console.log('Ready notification sent successfully.'))
              .catch(err => console.error('Error sending ready notification:', err));
          }, parseInt(ready_at, 10) * 60 * 1000);
        }
      } else if (status === 'rejected') {
        console.log(`Preparing to send rejection message for order ${updatedOrder.id}`);
        createMessage(`Order ${updatedOrder.id} was rejected.`)
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

// We are not using this route instead orders-api.js routes


