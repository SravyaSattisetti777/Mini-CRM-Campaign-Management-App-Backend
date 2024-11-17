const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const isAuthenticated = require('../middleware/auth');

router.get('/dashboard/total/customers', isAuthenticated, dashboardController.getTotalCustomers);
router.get('/dashboard/total/orders', isAuthenticated, dashboardController.getTotalOrders);
router.get('/dashboard/total/audiences', isAuthenticated, dashboardController.getTotalAudiences);
router.get('/dashboard/total/campaigns', isAuthenticated, dashboardController.getTotalCampaigns);
router.get('/dashboard/total/messages', isAuthenticated, dashboardController.getTotalMessages);

module.exports = router;