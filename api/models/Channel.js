const Sequelize = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(channel) {
  },
};

// naming the table in DB
const tableName = 'channel';

// the actual model
const Channel = sequelize.define('channel', {
  id: {
    primaryKey: true,
    type: Sequelize.STRING,
    unique: true
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
Channel.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = Channel;