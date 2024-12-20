const express = require('express');
const router  = express.Router();
const customerOrderQueries = require('../db/queries/customer_orders');
const createMessage =  require('../sms')

// Post route for /orders
router.post('/' , (req, res) => {

  const user_id = req.session.user_id;
  if(!user_id){
    return res.status(400).send({ error: 'must be logged in to use this service' });
  }

  const newOrder = req.body;

  if (!newOrder.items || newOrder.items.length === 0) {
    return res.status(400).send({ error: 'Order must include items.' });
  }

  newOrder.customer_id = user_id;

  customerOrderQueries
   .addOrder(newOrder, newOrder.items)
   .then((order) => {
    console.log('Order data:', order);

    createMessage("New order has been placed successfully!😊😊😊");
    res.status(201).send({ id: order.id, message: 'Order created successfully' });
  })
   .catch((e) => {
    console.error(e);
    res.status(500).send({ error: 'Failed to process the order.' });
   });
});

// GET route for individual order
router.get('/:id', (req, res) => {
  const id = req.params.id;

  customerOrderQueries.getOrderById(id)
  .then((order) => {
     if(order.length === 0) {
      return res.status(404).json({error: 'Order not found'});
     }
     res.json({ order });
  })
  .catch((err) => res.status(500).json({ error: err.message}));
});
module.exports = router;
