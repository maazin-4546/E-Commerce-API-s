const express = require("express")
const authorize = require("../middleware/Authorize")
const router = express.Router()

const { createOrder, getBuyerOrders, cancelOrder,
    trackOrder,
    singleOrderDetails,
    getSellerOrders,
    getSingleOrder,
    updateOrderStatus
} = require("../controllers/orderController")


router.post("/create-order", authorize(['customer']), createOrder)

router.get("/get-buyers-order", authorize(['customer']), getBuyerOrders)

router.get("/order-details/:id", authorize(['customer', 'seller']), singleOrderDetails)

router.get("/track/:id", authorize(['customer']), trackOrder)

router.patch('/cancel/:id', authorize(['customer']), cancelOrder);

//! -----------------  Seller Order Management ------------------------

router.get('/view-orders', authorize(['seller', 'customer']), getSellerOrders);

router.get('/single-order/:id', authorize(['seller', 'customer']), getSingleOrder);

router.patch('/changeOrderStatus/:id', authorize(['seller']), updateOrderStatus);


module.exports = router