const stripe = require("stripe")(`${process.env.STRIPE_API_SECRET}`);
const { User } = require("../models/user");

const createStripeSession = async (items, email, customer_id) => {
  const transformedItems = items.map((item) => ({
    quantity: parseInt(item.qty),
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.name,
        // description: item.description, //description here
        images: [item.imageUrl],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // shipping_rates: ["shr_1J5eGySCS64Pcw2pDqXziRGl"],
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URI}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URI}/cart`,
    metadata: {
      email,
      customer_id,
      product_id_array: JSON.stringify(items.map((item) => item._id)),
      qty_array: JSON.stringify(items.map((item) => item.qty)),
    },
  });

  return session;
};

const checkStripeSession = async (req, res) => {
  const session_id = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
};

const webhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntentSucceeded = event.data.object;
    const session = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentSucceeded.id,
    });

    const completeSession = await stripe.checkout.sessions.retrieve(
      session?.data[0]?.id
    );

    const id = completeSession.metadata.customer_id;
    const product_id_array = JSON.parse(
      completeSession.metadata.product_id_array
    );
    const qty_array = JSON.parse(completeSession.metadata.qty_array);

    const cartItems = product_id_array.map((id, idx) => ({
      id,
      qty: qty_array[idx],
    }));

    await User.findByIdAndUpdate(id, {
      $push: { orders: { $each: cartItems, $position: 0 } },
    });
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
};

module.exports = { webhook, createStripeSession, checkStripeSession };
