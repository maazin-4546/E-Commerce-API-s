const customerRoutes = require("./customerRoutes");
const adminRoutes = require("./adminRoutes");
const categoryRoutes = require("./CategoryRoutes");
const sellerRoutes = require("./sellerRoutes");
const cartRoutes = require("./CartRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const productRoutes = require("./productRoutes");



const routes = [
    { path: "/customer", route: customerRoutes },
    { path: "/admin", route: adminRoutes },
    { path: "/category", route: categoryRoutes },
    { path: "/seller", route: sellerRoutes },
    { path: "/cart", route: cartRoutes },
    { path: "/order", route: orderRoutes },
    { path: "/payment", route: paymentRoutes },
    { path: "/product", route: productRoutes },
];



module.exports = routes