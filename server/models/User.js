const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phone: {type: String},
    address: {type: String},
    isActive: {type: Boolean, default: true},
    isAdmin: {type: Boolean, default: false},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
  },
  {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
