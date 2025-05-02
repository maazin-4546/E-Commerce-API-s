const Order = require("../models/Order");
const Product = require("../models/Products");



const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const products = await Product.find({ seller: sellerId }).populate('category', 'name');

        res.status(200).send({
            success: true,
            message: 'Seller products fetched successfully',
            products
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch seller products',
            error: error.message
        });
    }
};


const getSellerInventory = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const products = await Product.find({ seller: sellerId });

        const summary = products.reduce(
            (acc, product) => {
                acc.totalProducts += 1;
                acc.totalStock += product.stock;
                acc.totalStockValue += product.price * product.stock;
                return acc;
            },
            { totalProducts: 0, totalStock: 0, totalStockValue: 0 }
        );

        res.status(200).send({
            success: true,
            message: 'Inventory summary fetched successfully',
            inventory: summary
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch inventory summary',
            error: error.message
        });
    }
};



module.exports = {    
    getSellerProducts,
    getSellerInventory,

}