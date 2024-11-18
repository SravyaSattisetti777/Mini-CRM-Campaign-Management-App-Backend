const Order = require("../models/Order");
const Customer = require("../models/Customer");
const { calculateTotalSpending, updateAudienceForCustomer } = require("../utils/helper");

exports.createOrder = async (req, res) => {
    try {
        const { email, name, amount, orderDate } = req.body;
        const userId = req.user.id;
        const customer = await Customer.findOne({ email, userId });
        const newOrder = new Order({
            name,
            amount,
            orderDate,
            customerId: customer._id,
            userId,
        });
        await newOrder.save();
        customer.totalSpending = await calculateTotalSpending(customer._id);
        await customer.save();
        await updateAudienceForCustomer(userId);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).sort({ orderDate: -1 }).populate("customerId", "name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: id, userId }).populate("customerId", "name email");
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Failed to fetch order details" });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updatedData = req.body;
        const order = await Order.findOneAndUpdate({ _id: id, userId },updatedData,{ new: true, runValidators: true });
        const customer = await Customer.findById(order.customerId);
        customer.totalSpending = await calculateTotalSpending(customer._id);
        await customer.save();
        await updateAudienceForCustomer(userId);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to update order" });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const order = await Order.findOneAndDelete({ _id: id, userId });
        const customer = await Customer.findById(order.customerId);
        customer.totalSpending = await calculateTotalSpending(customer._id);
        await customer.save();
        await updateAudienceForCustomer(userId);
        res.status(201).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
