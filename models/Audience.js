const mongoose = require("mongoose");
const audienceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conditions:[
        {
            field: { type: String, required: true },
            operator: { type: String, required: true},
            value: {type: mongoose.Schema.Types.Mixed, required: true}
        }
    ],
    size: { type: Number, required: true},
    userId: {type: String, required: true},
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
})
module.exports = mongoose.model('Audience', audienceSchema);