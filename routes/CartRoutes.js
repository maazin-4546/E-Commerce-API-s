const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize")

const { addToCart, getCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/CartController")



router.post("/add-items", authorize(['customer']), addToCart)

router.get("/user-cartItems", authorize(['customer']), getCart)

router.put('/update-quantity/:itemId', authorize(['customer']), updateCartItem);

router.delete('/removeItem/:itemId', authorize(['customer']), removeCartItem);

router.delete('/clear', authorize(['customer']), clearCart);



module.exports = router