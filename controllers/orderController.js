const Products = require("../models/Products");
const Order = require("../models/Order");
const { findById } = require("../services/services");


const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { sellerId, items, paymentInfo } = req.body;

        if (!sellerId || !items || items.length === 0 || !paymentInfo?.method) {
            return res.status(400).send({
                success: false,
                message: 'Buyer, seller, items, and payment method are required.',
            });
        }

        // Check product validity and availability
        for (const item of items) {
            const product = await Products.findById(item.productId);
            if (!product) {
                return res.status(400).send({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Insufficient stock for product: ${product.title}`,
                });
            }
        }

        const newOrder = new Order({
            buyerId: userId,
            sellerId,
            items,
            paymentInfo,
        });

        await newOrder.save();

        // Reduce stock for each product
        for (const item of items) {
            await Products.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        return res.status(201).send({
            success: true,
            message: 'Order created successfully',
            order: newOrder,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
};


const getBuyerOrders = async (req, res) => {
    try {
        const buyerId = req.user._id;

        const orders = await Order.find({ buyerId })
            .populate('items.productId', 'title price')
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            orders
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const buyerId = req.user._id;

        // Find the order that belongs to the logged-in buyer
        const order = await Order.findOne({ _id: id, buyerId });

        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order not found or unauthorized'
            });
        }

        // Only allow cancelling if the order is still pending or processing
        if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).send({
                success: false,
                message: `Cannot cancel an order that is ${order.status}.`
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).send({
            success: true,
            message: 'Order cancelled successfully',
            order
        });

    } catch (error) {
        console.error('Error cancelling order:', error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    }
};


const trackOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const buyerId = req.user._id;

        // Find order by id and check if the logged-in user is the buyer
        const order = await Order.findOne({ _id: id, buyerId });

        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order not found or unauthorized'
            });
        }

        // Return only tracking-related details
        res.status(200).send({
            success: true,
            message: 'Order status fetched successfully',
            tracking: {
                orderId: order._id,
                status: order.status,
                placedAt: order.createdAt,
                lastUpdated: order.updatedAt
            }
        });

    } catch (error) {
        console.error('Error tracking order:', error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to track order',
            error: error.message
        });
    }
};


const singleOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await findById(Order, id);

        return res.status(200).send({
            success: true,
            message: "order fetched successfully",
            order,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch order",
            error: error.message,
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
    createOrder,
    getBuyerOrders,
    cancelOrder,
    trackOrder,
    singleOrderDetails,
    getSellerOrders,
    updateOrderStatus,
    getSingleOrder,
}