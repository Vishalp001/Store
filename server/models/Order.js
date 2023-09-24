const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    user: {
      type: String,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        productName: {type: String},
      },
    ],
    totalAmount: {type: Number, required: true},
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'Cash on Delivery'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  {timestamps: true}
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
