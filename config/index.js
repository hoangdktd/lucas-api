const authRoutes = require('./routes/authRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');

const config = {
  migrate: false,
  authRoutes,
  rechargeRoutes,
  paymentRoutes,
  userRoutes,
  customerRoutes,
  port: process.env.PORT || '8080',
};

module.exports = config;
