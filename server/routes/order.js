const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      userId,
    } = req.body;

    const order = new Order({
      user,
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
    });

    const savedOrder = await order.save();

    // Update user's orders array
    await User.findByIdAndUpdate(
      userId,
      {$push: {orders: savedOrder._id}},
      {new: true}
    );

    res.json({message: 'Order created successfully', order: savedOrder});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occurred'});
  }
});

// Get Order of perticular user

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Get order of specific user
    const order = await Order.find({userId});

    if (!order) {
      return res.status(404).json({error: 'order item not found.'});
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({message: 'An error occurred'});
  }
});

module.exports = router;
