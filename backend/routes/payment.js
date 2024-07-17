const express = require('express');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment.js');
const crypto = require('crypto');
const router = express.Router();

router.post('/order', async (req, res) => {
  console.log('we are inside of order....');
  const { amount, currency, receipt, notes } = req.body;

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await instance.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });

    res.status(201).send(order);
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).send(error);
  }
});

router.post('/verify', async (req, res) => {
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id);
  const digest = shasum.digest('hex');

  if (digest === req.body.razorpay_signature) {
    const newPayment = new Payment( req.body );
    await newPayment.save();
    res.status(201).json({
      status: 'Success',
    });
  } else {
    res.status(500).json({
      status: 'Failure',
    });
  }
});

module.exports = router;
