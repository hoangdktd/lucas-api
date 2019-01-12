const Sequelize = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(customer) {
  },
};

// naming the table in DB
const tableName = 'customer';

// the actual model
const Customer = sequelize.define('customer', {
  customerId: {
    type: Sequelize.STRING,
    unique: true,
  },
  displayName: {
    type: Sequelize.STRING,
  },
  totalBusiness: {
    type: Sequelize.FLOAT,
  },
  numberOrder: {
    type: Sequelize.INTEGER,
  },
  timeWorking: {
    type: Sequelize.FLOAT,
  },
  listOrder: {
    type: Sequelize.ARRAY(Sequelize.STRING) ,
  }
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Customer.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = Customer;