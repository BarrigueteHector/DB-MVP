const { Router } = require('express');
const express = require('express');

const { authRequired }= require("../middlewares/validateToken.middlewares");
const { createCheckoutSession, confirmarCompraS } = require('../controllers/stripe.controller');

const router = Router();

router.post('/create-checkout-session', authRequired, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), confirmarCompraS );
    
module.exports = router;