const express = require('express');
const router = express.Router();
const analyticsQueries = require('../db/queries/userAnalytics');

// Top Customers
router.get('/top-customers', (req, res) => {
  analyticsQueries.getTopCustomers()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Engagement Trends
router.get('/engagement-trends', (req, res) => {
  analyticsQueries.getEngagementTrends()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Business Growth
router.get('/business-growth', (req, res) => {
  analyticsQueries.getBusinessGrowth()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Most Active Users
router.get('/most-active-users', (req, res) => {
  analyticsQueries.getMostActiveUsers()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
