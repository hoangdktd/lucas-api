const privateRoutes = require('./routes/privateRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const config = {
  migrate: false,
  privateRoutes,
  authRoutes,
  publicRoutes,
  rechargeRoutes,
  paymentRoutes,
  port: process.env.PORT || '8080',
};

module.exports = config;
