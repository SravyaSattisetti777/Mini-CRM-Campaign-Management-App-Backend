const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const isAuthenticated = require('../middleware/auth');

router.post('/campaigns', isAuthenticated, campaignController.createCampaign);
router.get('/campaigns/history', isAuthenticated, campaignController.getCampaign);
router.get('/campaigns/:id/details', isAuthenticated, campaignController.getCampaignDetails);

module.exports = router;