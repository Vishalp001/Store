const router = require('express').Router();
const CartItem = require('../models/Cart.js');
const User = require('../models/User.js');

// Create a new Product

// POST /cartItems
router.post('/', async (req, res) => {
  try {
    // Extract data from the request body
    const {product, quantity, price, user} = req.body;

    // Create a new cart item instance
    const cartItem = new CartItem({
      product,
      quantity,
      price,
      user,
    });

    // Save the cart item to the database
    const savedCartItem = await cartItem.save();

    res.status(201).json(savedCartItem);
  } catch (err) {
    res.status(500).json({error: 'Unable to create cart item.'});
  }
});

// GET /cartItems/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all the cart items associated with the user's cart
    const cartItems = await CartItem.find({user: userId});

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({error: 'Unable to get cart items for the user.'});
  }
});

// PUT /cartItems/:id
router.put('/:id', async (req, res) => {
  try {
    const {quantity, price} = req.body;

    const cartItemId = req.params.id;

    // Find the cart item by its _id
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({error: 'Cart item not found.'});
    }

    // Update the cart item properties
    cartItem.quantity = quantity;
    cartItem.price = price;

    // Save the updated cart item to the database
    const updatedCartItem = await cartItem.save();

    res.status(200).json(updatedCartItem);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// DELETE /cartItems/:id
router.delete('/:id', async (req, res) => {
  try {
    const cartItemId = req.params.id;

    // Find the cart item by its _id
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({error: 'Cart item not found.'});
    }

    // Delete the cart item
    await CartItem.findByIdAndRemove(cartItemId);

    res.status(200).json({message: 'Cart item deleted successfully.'});
  } catch (err) {
    res.status(500).json({error: 'Unable to delete cart item.'});
  }
});

// DELETE /cartItems/user/:userId
router.delete('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Delete all cart items associated with the user's cart
    await CartItem.deleteMany({user: userId});

    res
      .status(200)
      .json({message: 'All cart items for the user deleted successfully.'});
  } catch (err) {
    res.status(500).json({error: 'Unable to delete cart items for the user.'});
  }
});

module.exports = router;
