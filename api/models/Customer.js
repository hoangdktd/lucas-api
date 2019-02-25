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
  customerIdentity: {
    type: Sequelize.STRING,
    unique: true,
  },
  displayName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  birthday: {
    type: Sequelize.DATE,
  },
  address: {
    type: Sequelize.STRING,
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
  },
  avatar: {
    type: Sequelize.STRING,
  },
  totalSpent: {
    type: Sequelize.FLOAT,
  },
  timeWorking: {
    type: Sequelize.FLOAT,
  },
  facebookLink: {
    type: Sequelize.STRING,
  },
  note: {
    type: Sequelize.STRING,
  },
  channel: {
    type: Sequelize.STRING
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