const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, default: 1},
    orderDate: {type: Date, default: Date.now},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);