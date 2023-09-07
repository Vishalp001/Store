const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {user, products, totalAmount, shippingAddress, paymentMethod} =
      req.body;

    const order = new Order({
      user,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await order.save();

    // Update user's orders array
    await User.findByIdAndUpdate(
      user,
      {$push: {orders: savedOrder._id}},
      {new: true}
    );

    res.json({message: 'Order created successfully', order: savedOrder});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occurred'});
  }
});

module.exports = router;
