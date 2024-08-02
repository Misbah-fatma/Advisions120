const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: String,
  price: Number,
  type: String,
  features: [String],  // Change features to an array of strings
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
