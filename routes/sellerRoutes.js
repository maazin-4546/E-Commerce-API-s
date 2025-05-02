const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize")

const {
    getSellerProducts,
    getSellerInventory,
} = require("../controllers/sellerController")



router.get('/get-product', authorize(['seller']), getSellerProducts)

router.get('/get-stock-summary', authorize(['seller']), getSellerInventory)



module.exports = router
