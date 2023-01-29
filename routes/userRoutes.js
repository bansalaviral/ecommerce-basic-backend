const express = require("express");
const {
  loginUser,
  registerUser,
  order,
} = require("../controller/userController.js");
const { protect } = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/order", protect, order);

module.exports = router;
