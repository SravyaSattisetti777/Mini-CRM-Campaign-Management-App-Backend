const Customer = require('../models/Customer');
const Audience = require('../models/Audience');
const { buildCondition } = require('../utils/helper');

exports.createAudience = async (req, res) => {
    try {
        const { name, conditions } = req.body;
        const userId = req.user.id;
        const query = buildCondition(userId, conditions);
        const customers = await Customer.find(query);
        const newSize = customers.length;
        const audience = new Audience({
            name,
            conditions,
            size: newSize,
            userId,
            customers: customers.map((customer) => customer._id),
        });
        await audience.save();
        res.status(201).json(audience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAudiences = async (req, res) => {
    try {
        const userId = req.user.id;
        const audiences = await Audience.find({ userId });
        const audiencesWithSize = await Promise.all(
            audiences.map(async (audience) => {
                const query = buildCondition(userId, audience.conditions);
                audience.size = await Customer.countDocuments(query);
                return audience;
            })
        );
        res.status(200).json(audiencesWithSize);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAudienceById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const audience = await Audience.findOne({ _id: id, userId });
        const query = buildCondition(userId, audience.conditions);
        const customers = await Customer.find(query);
        audience.size = customers.length;
        res.status(200).json({ ...audience._doc, customers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAudience = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, conditions } = req.body;
        const userId = req.user.id;
        const audience = await Audience.findOne({ _id: id, userId });
        const query = buildCondition(userId, conditions);
        const customers = await Customer.find(query);
        const size = customers.length;
        audience.name = name;
        audience.conditions = conditions;
        audience.size = size;
        audience.customers = customers.map((customer) => customer._id);
        await audience.save();
        res.status(200).json(audience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAudience = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const audience = await Audience.findOneAndDelete({ _id: id, userId });
        await Customer.updateMany(
            { _id: { $in: audience.customers } },
            { $pull: { audiences: audience._id } } 
        );
        res.status(200).json({ message: "Audience deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};