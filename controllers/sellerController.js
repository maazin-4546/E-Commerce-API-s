const Category = require("../models/Category");
const Order = require("../models/Order");
const Product = require("../models/Products");



const addProduct = async (req, res) => {
    try {
        const { title, description, price, stock, images, category } = req.body;

        if (!title || !price || !stock || !category) {
            return res.status(400).send({
                success: false,
                message: 'Title, price, stock, and category are required.'
            });
        }

        const validCategory = await Category.findById(category);
        if (!validCategory) {
            return res.status(400).send({
                success: false,
                message: 'Invalid category ID.'
            });
        }

        const sellerId = req.user._id;

        const newProduct = new Product({
            title,
            description,
            price,
            stock,
            images,
            category,
            seller: sellerId
        });

        await newProduct.save();

        return res.status(201).send({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Failed to add product',
            error: error.message
        });
    }
};

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


//! -----------------  Seller Order Management------------------------

const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const orders = await Order.find({ sellerId })
            .populate('buyerId', 'name email')
            .populate('items.productId', 'title price images')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Seller orders fetched successfully",
            orders,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: "Failed to fetch seller orders",
            error: error.message,
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Find and update order
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },            
        );

        if (!updatedOrder) {
            return res.status(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};



const getSingleOrder = async (req, res) => {
    try {
        const { id } = req.params; 
        const sellerId = req.user._id; 

        // Find order
        const order = await Order.findOne({ _id: id, sellerId })
            .populate('buyerId', 'name email')
            .populate('items.productId', 'title price images')
            .exec();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order details fetched successfully',
            order
        });

    } catch (error) {
        console.error('Error fetching single order:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
};





module.exports = {
    addProduct,
    getSellerProducts,
    getSellerInventory,
    getSellerOrders,
    updateOrderStatus,
    getSingleOrder,
}