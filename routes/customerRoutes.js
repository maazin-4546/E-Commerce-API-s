const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize");

const {
    registerUser,
    loginUser,
    getAllProducts,
    getProductsByCategory
} = require("../controllers/customerController");



router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/get-all-products", authorize(['customer']), getAllProducts)

router.get('/products/categories/:id', authorize(['customer']), getProductsByCategory);


module.exports = router
