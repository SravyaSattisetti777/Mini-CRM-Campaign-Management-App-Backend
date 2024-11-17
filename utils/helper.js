const Audience = require('../models/Audience');
const Customer = require('../models/Customer');
const Order = require("../models/Order");

const dateFields = ['lastVisit'];

exports.updateAudienceForCustomer = async (userId) => {
    try {
        const audiences = await Audience.find({ userId });
        for (const audience of audiences) {
            const query = buildCondition(userId, audience.conditions);
            const updatedCustomers = await Customer.find(query);
            audience.customers = updatedCustomers.map(customer => customer._id);
            audience.size = updatedCustomers.length;
            await audience.save();
        }
    } catch (error) {
        console.error('Error updating audience:', error.message);
    }
}

exports.buildCondition = (userId, conditions) => {
    const query = { userId };
    conditions.forEach(condition => {
        const { field, operator, value } = condition;
        let target;
        if (dateFields.includes(field)) {
            const monthsAgo = Number(value);
            target = new Date();
            target.setMonth(target.getMonth() - monthsAgo);
        } else {
            target = Number(value);
        }
        if (operator === '>') {
            query[field] = { $gt: target };
        } else if (operator === '>=') {
            query[field] = { $gte: target };
        } else if (operator === '<') {
            query[field] = { $lt: target };
        } else if (operator === '<=') {
            query[field] = { $lte: target };
        } else if (operator === '!=') {
            query[field] = { $ne: target };
        } else {
            query[field] = { $eq: target };
        }
    });
    return query;
}

exports.calculateTotalSpending = async (customerId) => {
    const orders = await Order.find({ customerId });
    const totalSpending = orders.reduce((acc, order) => acc + order.amount, 0);
    return totalSpending;
};