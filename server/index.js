const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRout = require('./routes/product');
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');

const PORT = process.env.PORT || 8080;
// const PORT = 5000
const cors = require('cors');
const Product = require('./models/Product');
app.use(cors());

app.use(express.static(__dirname));

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Update all product Quantity
// const newStockQuantity = 5; // Replace with the new stock quantity
// Product.updateMany(
//   {}, // Empty filter means all documents match
//   {$set: {stockQuantity: newStockQuantity}}
// )
//   .then((result) => {
//     console.log('Number of products updated:', result.nModified);
//   })
//   .catch((error) => {
//     console.error('Error updating products:', error);
//   })
//   .finally(() => {
//     mongoose.disconnect();
//   });

app.use('/api/auth', authRoute);
app.use('/api/product', productRout);
app.use('/api/cart', cartRoute);

app.get('/', (req, res) => {
  res.send('Hello to Blog API');
});

app.listen(PORT, () => {
  console.log('Backend is running.');
});
