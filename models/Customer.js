const mongoose = require('mongoose')
const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    totalSpending: {type: Number, default: 0},
    lastVisit: {type: Date},
    visitCount: {type: Number, default: 0},
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Customer', customerSchema);