const mongoose = require('mongoose');

const CommunicationsLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], default: "SENT" },
  createdAt: { type: Date, default: Date.now },
  userId: {type: String, required: true},
});
module.exports = mongoose.model('CommunicationsLog', CommunicationsLogSchema);