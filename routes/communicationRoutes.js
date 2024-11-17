const express = require('express');
const router = express.Router();
const CommunicationController = require('../controllers/communicationLogController');
const isAuthenticated = require('../middleware/auth');

router.get('/messages', isAuthenticated, CommunicationController.getMessages);
router.post('/messages/send', isAuthenticated, CommunicationController.sendMessages);

module.exports = router;