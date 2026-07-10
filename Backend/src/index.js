const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const boleteraRoutes = require('./routes/boletera.routes');
const authRoutes = require('./routes/auth.routes');
const stripeRoutes = require('./routes/stripe.routes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // deja pasar sin parsear
  } else {
    express.json()(req, res, next);
  }
});

// app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(boleteraRoutes);
app.use(stripeRoutes);

// app.use((err, req, res, next) => {
//     return res.json({
//         message: err.message
//     })
// })

app.listen(process.env.PORT);
console.log("Server is OK");