const Customer = require("../models/Customer");
const Order = require("../models/Order");
const { updateAudienceForCustomer } = require('../utils/helper');

exports.createCustomer = async (req, res) => {
    try {
        const { name, email, totalSpending, lastVisit, visitCount } = req.body;
        const userId = req.user.id;
        const customer = new Customer({
            name,
            email,
            totalSpending,
            lastVisit,
            visitCount,
            userId,
        });
        await customer.save();
        await updateAudienceForCustomer(userId);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.id });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const customer = await Customer.findOne({ _id: id, userId });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updatedData = req.body;
        const customer = await Customer.findOneAndUpdate({ _id: id, userId }, updatedData, { new: true, runValidators: true });
        await updateAudienceForCustomer(userId);
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const customer = await Customer.findOneAndDelete({ _id: id, userId });
        await Order.deleteMany({ customerId: customer._id });
        await updateAudienceForCustomer(userId);
        res.status(201).json({ message: "Customer and their orders deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};