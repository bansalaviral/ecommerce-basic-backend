const express = require("express");
const {
  loginUser,
  registerUser,
} = require("../controller/userController.js");

const router = express.Router();

// login and register routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
