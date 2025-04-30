const express = require("express")
const authorize = require("../middleware/Authorize")
const router = express.Router()

const { createOrder, getBuyerOrders, cancelOrder, trackOrder } = require("../controllers/orderController")


router.post("/create-order", authorize(['customer']), createOrder)

router.get("/get-buyers-order", authorize(['customer']), getBuyerOrders)

router.get("/track/:id", authorize(['customer']), trackOrder)

router.patch('/cancel/:id', authorize(['customer']), cancelOrder);



module.exports = router