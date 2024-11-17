const Campaign = require('../models/Campaign');
const Audience = require('../models/Audience');
const CommunicationLog = require('../models/CommunicationLog');

exports.createCampaign = async (req, res) => {
    try {
        const { name, message, audienceId } = req.body;
        const userId = req.user.id;
        const campaign = new Campaign({
            name,
            message,
            audienceId,
            userId
        });
        await campaign.save();
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create campaign' });
  }
};

exports.getCampaign = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('audienceId', 'name size');
        
        const stats = await Promise.all(
            campaigns.map(async (campaign) => {
                const sentLogs = await CommunicationLog.find({ campaignId: campaign._id, status: 'SENT' }).countDocuments();
                const failedLogs = await CommunicationLog.find({ campaignId: campaign._id, status: 'FAILED' }).countDocuments();
                return { 
                    ...campaign.toObject(), 
                    sentCount: sentLogs, 
                    failedCount: failedLogs 
                };
            })
        );
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get campaigns' });
    }
};


exports.getCampaignDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const campaign = await Campaign.findOne({_id: id, userId: req.user.id }).populate('audienceId');
        const logs = await CommunicationLog.find({ campaignId: id }).populate('customerId', 'name email');

        const details = {
            campaignName: campaign.name,
            message: campaign.message,
            audienceSize: campaign.audienceId?.customers.length || 0,
            logs: logs.map(log => ({
                customerName: log.customerId?.name || 'Unknown',
                customerEmail: log.customerId?.email || 'Unknown',
                message: log.message,
                status: log.status,
                createdAt: log.createdAt,
            })),
        };
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaign details' });
    }
};