const CommunicationLog = require('../models/CommunicationLog');
const Campaign = require('../models/Campaign');
const Audience = require('../models/Audience');
const Customer = require('../models/Customer');

const sendMessageToCustomer = (customer, message) => {
    return `Hi ${customer.name}, ${message}`;
};

exports.sendMessages = async (req, res) => {
    const { campaignId, message } = req.body;
    try {
        const campaign = await Campaign.findOne({ _id: campaignId, userId: req.user.id}).populate('audienceId');
        const audience = campaign.audienceId;
        const customers = await Customer.find({ _id: { $in: audience.customers } });
        let sentCount = 0;
        let failedCount = 0;

        const promises = customers.map(async (customer) => {
            try {
                const personalizedMessage = sendMessageToCustomer(customer, message);
                const log = new CommunicationLog({
                    campaignId: campaign._id,
                    customerId: customer._id,
                    message: personalizedMessage,
                    userId: req.user.id,
                });
                await log.save();
                const status = Math.random() > 0.1 ? 'SENT' : 'FAILED';
                await updateDeliveryStatus(log._id, status);

                if (status === 'SENT') {
                    sentCount++;
                } else {
                    failedCount++;
                }
            } catch (logError) {
                return res.status(500).json({ error: logError.message });
            }
        });
        await Promise.all(promises);
        await Campaign.findByIdAndUpdate(campaignId, {
            $inc: { sentCount, failedCount },
        });
        res.status(200).json({ message: "Messages sent successfully", sentCount, failedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDeliveryStatus = async (logId, status) => {
    try {
        await CommunicationLog.findByIdAndUpdate(logId, { status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const logs = await CommunicationLog.find({ userId: req.user.id }).populate('campaignId', 'name').sort({ createdAt: -1 });
        const messages = logs.map((log) => ({
            _id: log._id,
            campaignName: log.campaignId?.name || 'Unknown Campaign',
            message: log.message,
            status: log.status,
            createdAt: log.createdAt,
        }));
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};