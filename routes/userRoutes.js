const express = require("express");
const {
  loginUser,
  registerUser,
  updateCart,
} = require("../controller/userController.js");
const { protect } = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/updateCart", protect, updateCart);

module.exports = router;
