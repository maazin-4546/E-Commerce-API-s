const express = require("express");
const router = express.Router()
const authorize = require("../middleware/Authorize");

const { createPaymentIntent, stripeWebhook } = require("../controllers/paymentController");


router.post('/create', authorize(['customer']), createPaymentIntent);

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)




module.exports = router