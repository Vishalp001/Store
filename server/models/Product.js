const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    features: {
      type: [String],
    },
    images: {
      type: [String],
    },
    ratings: {
      average: {type: Number, default: 0},
      total: {type: Number, default: 0},
      reviews: [
        {
          username: {type: String},
          rating: {type: Number},
          comment: {type: String},
        },
      ],
    },
    tags: {type: [String]},
  },
  {timestamps: true}
);

// Create the Product model using the schema

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
