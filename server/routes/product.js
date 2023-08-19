const router = require('express').Router();
const Product = require('../models/Product.js');

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

module.exports = router;
