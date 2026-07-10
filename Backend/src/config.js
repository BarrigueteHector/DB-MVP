const { config } = require('dotenv');
config()

module.exports = {
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    },

    auth:{
        secret_key: process.env.SECRET_KEY
    },

    payment:{
        stripe_key: process.env.STRIPE_KEY,
        stripe_webhook_key: process.env.STRIPE_WEBHOOK_KEY
    }
}