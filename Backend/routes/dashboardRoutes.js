const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { getDashboardSummary } = require('../controllers/dashboardController');

// Allow all authenticated users (Viewer, Analyst, Admin) to see summary
router.get('/summary', auth, roleGuard(['Viewer', 'Analyst', 'Admin']), getDashboardSummary);

module.exports = router;
