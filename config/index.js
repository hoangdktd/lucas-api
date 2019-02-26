const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const channelRoutes = require('./routes/channelRoutes');

const config = {
  migrate: false,
  authRoutes,
  userRoutes,
  customerRoutes,
  orderRoutes,
  channelRoutes,
  port: process.env.PORT || '8080'
};

module.exports = config;
