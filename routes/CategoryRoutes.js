const express = require("express")
const router = express.Router()

const { availableCategories, addCategory, updateCategory, deleteCategory, getSingleCategory } = require("../controllers/categoryController")

const authorize = require("../middleware/Authorize")


router.get('/all/categories', authorize(['admin']), availableCategories)

router.get('/single-category/:id', authorize(['admin']), getSingleCategory)

router.post('/add/category', authorize(['admin']), addCategory)

router.put('/update-category/:id', authorize(['admin']), updateCategory);

router.delete('/delete-category/:id', authorize(['admin']), deleteCategory);


module.exports = router