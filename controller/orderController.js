const { User } = require("../models/user.js");
const { Product } = require("../models/Product.js");
const { createStripeSession } = require("./stripeController.js");

const createOrder = async (req, res) => {
  const { cartItems } = req.body;
  const { id } = req.user;
  const { email } = await User.findById(id);

  const productDetailPromises = cartItems.map(({ id }) => {
    const productDetailPromise = Product.findById(id);
    return productDetailPromise;
  });

  let allProductDetails = await Promise.all(productDetailPromises);

  let items = allProductDetails.map((item, idx) => ({
    ...item.toObject(),
    ["qty"]: cartItems[idx].qty,
  }));

  const session = await createStripeSession(items, email, id);

  return res.status(200).json({
    url: session.url,
  });
};

const getAllOrders = async (req, res) => {
  const { id } = req.user;
  const { orders } = await User.findById(id);

  const productDetailPromises = orders.map(({ id }) => {
    const productDetailPromise = Product.findById(id);
    return productDetailPromise;
  });

  let allProductDetails = await Promise.all(productDetailPromises);
  allProductDetails = allProductDetails.map((prod, idx) => ({
    ...prod.toObject(),
    ["qty"]: orders[idx]["qty"],
    ["createdAt"]: orders[idx]["createdAt"],
  }));

  return res.status(200).json(allProductDetails);
};

module.exports = { createOrder, getAllOrders };
