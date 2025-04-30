const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize")

const { addProduct,
    getSellerProducts,
    getSellerInventory,
    getSellerOrders,
    updateOrderStatus,
    getSingleOrder
} = require("../controllers/sellerController")


router.post('/add-product', authorize(['seller']), addProduct)

router.get('/get-product', authorize(['seller']), getSellerProducts)

router.get('/get-stock-summary', authorize(['seller']), getSellerInventory)


//! -----------------  Seller Order Management------------------------

router.get('/orders', authorize(['seller', 'customer']), getSellerOrders);

router.get('/single-order/:id', authorize(['seller', 'customer']), getSingleOrder);

router.patch('/changeOrderStatus/:id', authorize(['seller', 'customer']), updateOrderStatus);




module.exports = router
