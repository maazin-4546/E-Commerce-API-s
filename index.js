const express = require("express");
const dbConnection = require("./db/DbConnection");
const cookieParser = require('cookie-parser');

const customerRoutes = require("./routes/customerRoutes")
const adminRoutes = require("./routes/adminRoutes")
const categoryRoutes = require("./routes/CategoryRoutes")
const sellerRoutes = require("./routes/sellerRoutes")
const cartRoutes = require("./routes/CartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

const app = express()
require("dotenv").config();


const PORT = 5000

app.use(express.json())
app.use(cookieParser());

app.use("/customer", customerRoutes)
app.use("/admin", adminRoutes)
app.use("/category", categoryRoutes)
app.use("/seller", sellerRoutes)
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)
app.use("/payment", paymentRoutes)

dbConnection()


app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })