const express = require("express");
const { loginUser, registerUser, getMe } = require("../controller/userController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", getMe);
module.exports = router;
