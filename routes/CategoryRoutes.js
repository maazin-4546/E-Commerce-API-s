const express = require("express")
const router = express.Router()

const { availableCategories, addCategory } = require("../controllers/categoryController")

const authorize = require("../middleware/Authorize")


router.get('/all/categories', authorize(['admin']), availableCategories)

router.post('/add/category', authorize(['admin']), addCategory)


module.exports = router