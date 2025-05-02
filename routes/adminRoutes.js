const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize")

const {
    getAllUsers,
    approveSellers,
    deleteUser,
    allSellers,
    getAllOrders
} = require("../controllers/adminController")



router.get("/all-users", authorize(['admin']), getAllUsers)

router.get("/all-orders", authorize(['admin']), getAllOrders)

router.patch('/approve-user/:id', authorize(['admin']), approveSellers)

router.delete('/delete-user/:id', authorize(['admin']), deleteUser)

router.get('/all-sellers', authorize(['admin']), allSellers)





module.exports = router
