const Sequelize = require('sequelize');
const Customer = require('../models/Customer');
const User = require('../models/User');
const oConstant = require('../utils/constant');
// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(order) {
  },
};

// naming the table in DB
const tableName = 'order';

// the actual model
const Order = sequelize.define('order', {
  // orderId: {
  //   type: Sequelize.STRING,
  //   unique: true,
  // },
  status: {
    type: Sequelize.ENUM,   //'ordered', 'delivered', 'cancelled'
    values: oConstant.orderStatusEnum
  },
  customerIdentity: {
    type: Sequelize.INTEGER,
    reference: {
      model: Customer,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  saleId: {
    type: Sequelize.INTEGER,
    reference: {
      model: User,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  channel: {
    type: Sequelize.STRING,
  },
  createDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  finishedDate: {
    type: Sequelize.DATE
  },
  priceOrder: {
    type: Sequelize.FLOAT
  },
  note: {
    type: Sequelize.STRING
  },
  infoOrderLink: {
    type: Sequelize.STRING
  },
  backupOrderLink: {
    type: Sequelize.STRING
  },
  paymentStatus: {
    type: Sequelize.ENUM,
    values: oConstant.paymentStatusEnum
  },
  designerId: {
    type: Sequelize.INTEGER,
    reference: {
      model: User,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  typeDesigner: {
    type: Sequelize.ENUM,
    values: oConstant.typeDesignerEnum
  },
  idPackage: {
    type: Sequelize.STRING
  },
  numberPackage: {
    type: Sequelize.INTEGER
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
  },
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Order.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = Order;