// models/PendingRequestModel.js
const mongoose = require('mongoose');

const pendingRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolRegistration', required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const PendingRequestModel = mongoose.model('PendingRequest', pendingRequestSchema);
module.exports = PendingRequestModel;
