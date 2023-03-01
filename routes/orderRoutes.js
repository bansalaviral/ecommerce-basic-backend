const express = require("express");
const {
  createOrder,
  getAllOrders,
} = require("../controller/orderController.js");
const { protect } = require("../middleware/auth.js");

const router = express.Router();

// order routes
router.post("/", protect, createOrder);
router.get("/", protect, getAllOrders);

module.exports = router;
