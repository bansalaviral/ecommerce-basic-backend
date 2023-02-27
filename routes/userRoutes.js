const express = require("express");
const {
  loginUser,
  registerUser,
  postOrder,
  getOrder
} = require("../controller/userController.js");
const { protect } = require("../middleware/auth.js");

const router = express.Router();

// login and register routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// order routes
router.patch("/order", protect, postOrder);
router.get("/order", protect, getOrder);

module.exports = router;
