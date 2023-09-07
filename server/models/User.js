const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {type: String, required: true},
  mobileNo: {type: String, required: true},
  pincode: {type: String, required: true},
  locality: {type: String, required: true},
  area: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  landmark: {type: String},
  alternatePhoneNo: {type: String},
  addressType: {type: String, enum: ['Home', 'Work'], required: true},
});

const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phone: {type: String},
    address: [addressSchema],
    isActive: {type: Boolean, default: true},
    isAdmin: {type: Boolean, default: false},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
  },
  {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
