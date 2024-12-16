const express = require('express');
const router = express.Router();
const dashboardQueries = require('../db/queries/dashboard');

// Total Sales
router.get('/total-sales', (req, res) => {
  dashboardQueries.getTotalSales()
    .then(data => res.json(data))
    .catch(err => {
      console.error('Error fetching total sales:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Total Orders
router.get('/total-orders', (req, res) => {
  dashboardQueries.getTotalOrders()
    .then(data => res.json(data))
    .catch(err => {
      console.error('Error fetching total orders:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Active Users
router.get('/active-users', (req, res) => {
  dashboardQueries.getActiveUsers()
    .then(data => res.json(data))
    .catch(err => {
      console.error('Error fetching active users:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Most Sold Item
router.get('/most-sold-item', (req, res) => {
  dashboardQueries.getMostSoldItem()
    .then(data => res.json(data))
    .catch(err => {
      console.error('Error fetching most sold item:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Recent Activity (linking to query)
router.get('/recent-activity', (req, res) => {
  dashboardQueries.getRecentActivity()
    .then(data => res.json(data))
    .catch(err => {
      console.error('Error fetching recent activity:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Optional consolidated endpoint
router.get('/metrics', async (req, res) => {
  try {
    const [totalSales, totalOrders, activeUsers, mostSoldItem] = await Promise.all([
      dashboardQueries.getTotalSales(),
      dashboardQueries.getTotalOrders(),
      dashboardQueries.getActiveUsers(),
      dashboardQueries.getMostSoldItem()
    ]);

    res.json({
      totalSales,
      totalOrders,
      activeUsers,
      mostSoldItem
    });
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err.message);
    res.status(500).json({ error: 'Failed to load metrics' });
  }
});

module.exports = router;

