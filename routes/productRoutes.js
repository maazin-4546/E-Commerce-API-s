const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize");


const {
    getAllProducts,
    getProductsByCategory,
    addProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    filterProductsByPrice,
    getOutOfStockProducts,
    searchProducts
} = require("../controllers/productController");


router.post('/add-product', authorize(['seller']), addProduct)

router.get("/get-all-products", authorize(['customer']), getAllProducts)

router.get('/single-product/:id', authorize(['customer', 'seller']), getSingleProduct);

router.get('/categories/:id', authorize(['customer']), getProductsByCategory);

router.put('/update-product/:id', authorize(['seller']), updateProduct);

router.delete('/delete-product/:id', authorize(['seller']), deleteProduct);

router.post('/filter-by-price', authorize(['seller']), filterProductsByPrice);

router.get('/filter/out-of-stock', authorize(['seller']), getOutOfStockProducts);

router.get('/search', authorize(['admin', 'customer', 'seller']), searchProducts);


module.exports = router