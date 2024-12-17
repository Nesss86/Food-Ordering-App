const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');

router.get('/', (req, res) => {
  orderQueries.getOrders() // A query to fetch all orders
    .then(orders => res.json({ orders }))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  orderQueries.updateOrderStatus(id, status) // A query to update order status
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/' , (req, res) => {
  const user_id = req.session.user_id;
  if(!user_id){
    return res.send({ error: 'must be logged in to use this service'});
  }

  const newOrder = req.body;
  newOrder.customer_id = user_id;
  orderQueries
   .addOrder(newOrder)
   .then((order) => {
    res.send(order);
   })
   .catch((e) => {
    console.error(e);
   })
})
module.exports = router;
