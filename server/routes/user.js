const router = require('express').Router();
const User = require('../models/User.js');

// Add a new address to user's addresses
router.post('/:userId/addresses', async (req, res) => {
  try {
    const {userId} = req.params;
    const {newAddress} = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    user.address.push(newAddress);
    await user.save();

    res.json({message: 'Address added successfully', user});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occurred'});
  }
});

module.exports = router;
