const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: { type: String },
  dateTime: { type: Date },
  link: { type: String },
  role: { type: String},
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('LiveClass', liveClassSchema);