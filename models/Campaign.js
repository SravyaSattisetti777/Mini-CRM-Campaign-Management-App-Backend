const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    audienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Audience', required: true },
    createdAt: { type: Date, default: Date.now },
    userId: {type: String, required: true},
  }
);

module.exports = mongoose.model('Campaign', campaignSchema);