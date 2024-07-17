const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
});

module.exports = mongoose.model('Payment', PaymentSchema);
