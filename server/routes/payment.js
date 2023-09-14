const router = require('express').Router();
const stripe = require('stripe')(
  'sk_test_51NpFpYSEKxyQ7sG7JPU3IU9XXvmqTcB12nadR1yUsA61oaAb3K8XSyGyG1IuIVAwjLYYkYsLtsY3dF8O0zB6b1Fn00vqQtH4o3'
);

router.post('/', async (req, res) => {
  const {products} = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: product.productName,
      },
      unit_amount: product.productPrice * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });
  const response = res.json({id: session.id});
  console.log(response, 'response');
});

module.exports = router;
