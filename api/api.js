/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');

/**
 * server configuration
 */
const config = require('../config/');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedAuthRoutes = mapRoutes(config.authRoutes, 'api/controllers/');
const mappedRechargeRoutes = mapRoutes(config.rechargeRoutes, 'api/controllers/');
const mappedPaymentRoutes = mapRoutes(config.paymentRoutes, 'api/controllers/');
const mappedUserRoutes = mapRoutes(config.userRoutes, 'api/controllers/');
const mappedCustomerRoutes = mapRoutes(config.customerRoutes, 'api/controllers/');
const mappedCategoryRoutes = mapRoutes(config.categoryRoutes, 'api/controllers/');
const mappedProductRoutes = mapRoutes(config.productRoutes, 'api/controllers/');
const mappedCommandsRoutes = mapRoutes(config.commandsRoutes, 'api/controllers/');
const mappedOrderRoutes = mapRoutes(config.orderRoutes, 'api/controllers/');
const mappedChannelRoutes = mapRoutes(config.channelRoutes, 'api/controllers/');

const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// secure your private routes with jwt authentication middleware
// app.all('/private/*', (req, res, next) => auth(req, res, next));

app.all('/user*', (req, res, next) => auth(req, res, next));
app.all('/customers*', (req, res, next) => auth(req, res, next));
app.all('/categories*', (req, res, next) => auth(req, res, next));
app.all('/products*', (req, res, next) => auth(req, res, next));
app.all('/commands*', (req, res, next) => auth(req, res, next));
app.all('/order*', (req, res, next) => auth(req, res, next));
app.all('/channels*', (req, res, next) => auth(req, res, next));
// fill routes for express application
app.use('/auth', mappedAuthRoutes);
app.use('/recharge', mappedRechargeRoutes);
app.use('/payment', mappedPaymentRoutes);
app.use('/user', mappedUserRoutes);
app.use('/customers', mappedCustomerRoutes);
app.use('/categories', mappedCategoryRoutes);
app.use('/products', mappedProductRoutes);
app.use('/commands', mappedCommandsRoutes);
app.use('/order', mappedOrderRoutes);
app.use('/channels', mappedChannelRoutes);

server.listen(config.port, (err) => {
  console.log('---------------   '  + config.port);
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  console.log('start');
  return DB;
});
