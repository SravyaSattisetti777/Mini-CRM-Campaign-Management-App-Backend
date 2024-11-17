const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const isAuthenticated = require('../middleware/auth');

router.post('/customers', isAuthenticated, customerController.createCustomer);
router.get('/customers/list', isAuthenticated, customerController.getCustomers);
router.get('/customers/:id', isAuthenticated, customerController.getCustomerById);
router.put('/customers/edit/:id', isAuthenticated, customerController.updateCustomer);
router.delete('/customers/delete/:id', isAuthenticated, customerController.deleteCustomer);

module.exports = router;