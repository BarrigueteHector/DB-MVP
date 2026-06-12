const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const boleteraRoutes = require('./routes/boletera.routes')
const authRoutes = require('./routes/auth.routes')

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(boleteraRoutes);

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(4000);
console.log("Server on port 4000");