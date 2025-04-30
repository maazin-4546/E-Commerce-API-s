const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
