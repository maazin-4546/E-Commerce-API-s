const Cart = require("../models/Cart");


const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).send({
                success: false,
                message: 'Product ID and valid quantity are required.'
            });
        }

        // Check if cart exists for user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                // If exists, update quantity
                existingItem.quantity += quantity;
            } else {
                // Else, add new item
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();

        res.status(200).send({
            success: true,
            message: 'Product added to cart successfully',
            cart
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to add product to cart',
            error: error.message
        });
    }
};


// Get current user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }

        res.status(200).send({
            success: true,
            cart,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch cart',
            error: error.message,
        });
    }
};


const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).send({
                success: false,
                message: 'Quantity must be at least 1',
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }

        const item = cart.items.id(itemId);

        if (!item) {
            return res.status(404).send({
                success: false,
                message: 'Cart item not found',
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).send({
            success: true,
            message: 'Cart item updated successfully',
            cart,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to update cart item',
            error: error.message,
        });
    }
};


const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }

        const itemExists = cart.items.some((item) => item._id.toString() === itemId);

        if (!itemExists) {
            return res.status(404).send({
                success: false,
                message: 'Cart item not found',
            });
        }

        // Remove item by filtering
        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

        await cart.save();

        res.status(200).send({
            success: true,
            message: 'Cart item removed successfully',
            cart,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to remove cart item',
            error: error.message,
        });
    }
};


const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }

        // Empty the items array
        cart.items = [];
        await cart.save();

        res.status(200).send({
            success: true,
            message: 'Cart cleared successfully',
            cart,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to clear cart',
            error: error.message,
        });
    }
};






module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart };


