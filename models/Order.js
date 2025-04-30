const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    sellerId: {
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
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['cod', 'card', 'upi', 'netbanking'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        transactionId: {
            type: String,
            default: ''
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
