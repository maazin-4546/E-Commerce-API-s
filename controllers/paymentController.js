const Order = require('../models/Order');
const stripe = require('../utils/Stripe');



const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd', orderId } = req.body;
        const userId = req.user.id;

        if (!amount || !userId || !orderId) {
            return res.status(400).send({
                success: false,
                message: "Amount, orderId and authentication are required"
            });
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert dollars to cents
            currency,
            payment_method_types: ['card'],
            metadata: {
                userId: userId,
                orderId: orderId,
                integration_check: 'accept_a_payment'
            }
        });

        res.status(200).send({
            success: true,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to create payment',
            error: error.message
        });
    }
};


const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {        
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            
            console.log('PaymentIntent Succeeded:', paymentIntent.id);

            const orderId = paymentIntent.metadata.orderId;  
            
            await Order.findByIdAndUpdate(orderId, { status: 'processing' });

            console.log('Order updated to processing');
        }

        res.status(200).send({ received: true });

    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};




module.exports = { createPaymentIntent, stripeWebhook };
