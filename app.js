const express = require('express');
const stripe = require('stripe')('sk_test_51PF9H6H4YeXTNFtDtQ5vFN1AgyWuRR8wXBFnGA0OXcmWP37k9oRnTvNANMnzGwzvAvgTymnkkqsdppF33066jJxK00vJ3PYG8J'); // Replace with your secret key
const cors = require('cors');

// Create an instance of Express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Route to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { productName, price } = req.body;

  const baseUrl = 'http://localhost:5173';
  const successUrl = `${baseUrl}/`;
  const cancelUrl = `${baseUrl}/`;

  // Create a checkout session using Stripe API
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName || 'Sample Product',
          },
          unit_amount: price || 1000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  // Return the session ID as JSON response
  res.json({ id: session.id });
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});