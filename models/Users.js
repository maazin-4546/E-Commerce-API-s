const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isApproved: { type: Boolean, default: false },
    role: { type: String, enum: ['admin', 'seller', 'customer'], default: 'customer' }
}, { timestamps: true })

const Users = mongoose.model("Users", userSchema)

module.exports = Users;