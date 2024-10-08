const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  course: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
});

module.exports = mongoose.model("Payment", paymentSchema);
