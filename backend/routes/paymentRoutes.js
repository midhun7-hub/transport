const express = require("express");
const router = express.Router();
const razorpay = require("../razorpay");

router.post("/create-order", async (req, res) => {
  try {
    console.log("Create order hit"); // DEBUG LINE

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

module.exports = router;
