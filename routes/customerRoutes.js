const express = require("express")
const router = express.Router()
const authorize = require("../middleware/Authorize");

const {
    registerUser,
    loginUser,
    updateUserProfile,
    logoutUser
} = require("../controllers/customerController");



router.post("/register", registerUser)

router.post("/login", loginUser)

router.put("/update-profile", authorize(['customer']), updateUserProfile)

router.post('/logout', logoutUser);


module.exports = router
