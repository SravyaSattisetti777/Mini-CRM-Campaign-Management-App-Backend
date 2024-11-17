const express = require('express');
const router = express.Router();
const audienceController = require('../controllers/audienceController');
const isAuthenticated = require('../middleware/auth');

router.post('/audiences', isAuthenticated, audienceController.createAudience);
router.get('/audiences/list', isAuthenticated, audienceController.getAudiences); 
router.get('/audiences/:id', isAuthenticated, audienceController.getAudienceById);
router.put('/audiences/edit/:id', isAuthenticated, audienceController.updateAudience);
router.delete('/audiences/delete/:id', isAuthenticated, audienceController.deleteAudience);

module.exports = router;