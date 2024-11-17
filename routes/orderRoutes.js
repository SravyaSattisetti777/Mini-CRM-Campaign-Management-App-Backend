const express = require ('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const isAuthenticated = require('../middleware/auth');

router.post('/orders', isAuthenticated, orderController.createOrder);
router.get('/orders/list', isAuthenticated, orderController.getOrders);
router.get('/orders/:id', isAuthenticated, orderController.getOrderById);
router.put('/orders/edit/:id', isAuthenticated, orderController.updateOrder);
router.delete('/orders/delete/:id', isAuthenticated, orderController.deleteOrder);

module.exports = router;