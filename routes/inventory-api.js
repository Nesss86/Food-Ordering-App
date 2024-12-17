const express = require('express');
const router = express.Router();
const inventoryQueries = require('../db/queries/inventory');

// Get All Inventory
router.get('/', (req, res) => {
  inventoryQueries.getItemsInStock()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});


// Get Low Stock Items
router.get('/low-stock', (req, res) => {
  inventoryQueries.getLowStockItems()
    .then(data => res.json({ lowStock: data }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get Restock Recommendations
router.get('/restock', (req, res) => {
  inventoryQueries.getRestockRecommendations()
    .then(data => res.json({ restock: data }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;

