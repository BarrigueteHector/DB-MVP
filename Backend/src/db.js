const { Pool } = require('pg');
const { db } = require('./config');

const pool = new Pool({
    connectionString: db.db_url,
    ssl: {
        rejectUnauthorized: false,
        sslmode: 'verify-full'
    }

    // user: db.user,
    // password: db.password,
    // host: db.host,
    // port: db.port,
    // database: db.database
})

module.exports = pool;