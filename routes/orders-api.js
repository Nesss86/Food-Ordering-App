router.get('/', (req, res) => {
  ordersQueries.getOrders() // A query to fetch all orders
    .then(orders => res.json({ orders }))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  ordersQueries.updateOrderStatus(id, status) // A query to update order status
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
