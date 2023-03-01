const express = require("express");
const {
  webhook,
  checkStripeSession,
} = require("../controller/stripeController.js");

const router = express.Router();

router.post("/webhook", webhook);
router.get("/check", checkStripeSession);

module.exports = router;
