const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey12345',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret67890',
});

module.exports = razorpay;
