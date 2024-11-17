const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Audience = require('../models/Audience');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');

exports.getTotalCustomers = async (req, res) => {
    try {
        const total = await Customer.countDocuments({ userId: req.user.id });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalOrders = async (req, res) => {
    try {
        const total = await Order.countDocuments({ userId: req.user.id });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalAudiences = async (req, res) => {
    try {
        const total = await Audience.countDocuments({ userId: req.user.id });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalCampaigns = async (req, res) => {
    try {
        const total = await Campaign.countDocuments({ userId: req.user.id });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalMessages = async (req, res) => {
    try {
        const sent = await CommunicationLog.countDocuments({ userId: req.user.id, status: 'SENT' });
        const failed = await CommunicationLog.countDocuments({ userId: req.user.id, status: 'FAILED' });
        res.json({ sent, failed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
