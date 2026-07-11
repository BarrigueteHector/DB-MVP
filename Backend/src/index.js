const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const boleteraRoutes = require('./routes/boletera.routes');
const authRoutes = require('./routes/auth.routes');
const stripeRoutes = require('./routes/stripe.routes');

const { back, urls } = require('./config');

const app = express();

app.use(cors({
    origin: urls.front,
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

app.listen(back.port);
console.log("Server is OK");