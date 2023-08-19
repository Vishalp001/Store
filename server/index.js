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
app.use(cors());

app.use(express.static(__dirname));

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoute);
app.use('/api/product', productRout);
app.use('/api/cart', cartRoute);

app.get('/', (req, res) => {
  res.send('Hello to Blog API');
});

app.listen(PORT, () => {
  console.log('Backend is running.');
});
