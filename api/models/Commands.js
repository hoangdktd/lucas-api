const Sequelize = require('sequelize');
const Customer = require('../models/Customer');
const User = require('../models/User');
// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(commands) {
  },
};

// naming the table in DB
const tableName = 'commands';

// the actual model
const Commands = sequelize.define('commands', {
  orderDate: {
    type: Sequelize.DATE,
  },
  finishedDate:{
    type: Sequelize.DATE,
  },
  customerIdentity: {
    type: Sequelize.STRING,
    // reference: {
    //   model: Customer,
    //   key: 'id'
    // },
  },
  totalPrice:{
      type: Sequelize.INTEGER
  },
  totalProduct:{
      type: Sequelize.INTEGER
  },
  status: {
      type: Sequelize.STRING
  },
  saleId: {
    type: Sequelize.STRING,
    // reference: {
    //   model: User,
    //   key: 'id',
    // }
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
  }
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Commands.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = Commands;