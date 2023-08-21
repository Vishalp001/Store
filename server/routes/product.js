const router = require('express').Router();
const Product = require('../models/Product.js');
const User = require('../models/User.js');

// Create a new Product

router.post('/create', async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({_id: -1});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Single Products
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to like a product
router.post('/like/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.body.userId;
    const action = req.query.action;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({message: 'Product not found'});
    }

    if (action === 'like') {
      if (user.likedProducts.includes(product._id)) {
        res.status(400).json({message: 'Product already liked by the user'});
      }
      user.likedProducts.push(product._id);
    } else if (action === 'dislike') {
      if (!user.likedProducts.includes(product._id)) {
        return res
          .status(400)
          .json({message: 'Product already dislike by the user'});
      }

      // Remove the product's ID from the user's likedProducts array
      // user.likedProducts = user.likedProducts.filter(
      //   (likedProductId) => likedProductId !== product._id
      // );

      const index = user.likedProducts.indexOf(product._id);
      if (index !== -1) {
        user.likedProducts.splice(index, 1);
      }
    } else {
      return res.status(400).json({message: 'Invalid action'});
    }
    await user.save();
    res.json({message: `Product ${action}d successfully`});
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error.message);
  }
});

module.exports = router;
