const stripe = require('stripe')(process.env.STRIPE_KEY);
const pool = require('../db'); // ajusta al nombre real de tu conexión
const { procesarCompra } = require('./boletera.controller');
const { payment } = require('../config');

const createCheckoutSession = async (req, res, next) => {
    try {
        const { tipo_boleto_id } = req.body;

        const tipoBoleto = await pool.query('SELECT * FROM tipos_boleto WHERE id = $1', [tipo_boleto_id]);

        if (tipoBoleto.rows[0].boletos_disponibles <= 0)
             return res.status(400).json({ message: 'No hay boletos disponibles' });

        if (tipoBoleto.rows.length === 0) 
            return res.status(404).json({ message: 'Tipo de boleto no encontrado' });

        const { precio, tipo, evento_id } = tipoBoleto.rows[0];

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: `Boleto ${tipo}`,
                        },
                        unit_amount: Math.round(precio * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                },    
            ],
                
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mis-boletos?success=true&id=${evento_id}`,
            cancel_url: `${process.env.FRONTEND_URL}/evento/${tipoBoleto.rows[0].evento_id}`,
            
            metadata: {
                tipo_boleto_id: tipo_boleto_id,
                usuario_id: req.user.id,
                evento_id
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        next(error);
    }
};

const confirmarCompraS = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    // console.log('Tipo de body:', typeof req.body, Buffer.isBuffer(req.body));

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, payment.stripe_webhook_key);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { tipo_boleto_id, usuario_id, evento_id } = session.metadata;

        console.log('Webhook recibido - tipo_boleto_id:', tipo_boleto_id, 'usuario_id:', usuario_id, "evento_id:", evento_id);

        try {
            await procesarCompra(tipo_boleto_id, usuario_id, evento_id);
            console.log('procesarCompra completado exitosamente');
        } catch (error) {
            console.error('Error procesando compra:', error.message);
  
            // reembolso automático si no se pudo procesar
            await stripe.refunds.create({
                payment_intent: session.payment_intent
            });
            // aun así respondemos 200 para que Stripe no reintente indefinidamente
        }
    }

    res.json({ received: true }); // siempre 200 a Stripe
}

module.exports = { createCheckoutSession, confirmarCompraS };