const express = require('express');
const router  = express.Router();
const customerOrderQueries = require('../db/queries/customer_orders');

// Post route for /orders
router.post('/' , (req, res) => {
  const user_id = req.session.user_id;
  if(!user_id){
    return res.send({ error: 'must be logged in to use this service'});
  }

  const newOrder = req.body;
  newOrder.customer_id = user_id;
  customerOrderQueries
   .addOrder(newOrder)
   .then((order) => {
    res.send(order);
   })
   .catch((e) => {
    console.error(e);
   })
})

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
