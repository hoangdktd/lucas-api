// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Customer = require('../models/Customer');
const User = require('../models/User');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (accessUser, customerData, callback) => {
        try {
            // console.log(!oValidator.isAlphanumeric(customerData.displayName));
            console.log(accessUser.accessUserRight);
            // if (!oValidator.isAlphanumeric(customerData.displayName)){
            //     return callback(4178, 'invalid data', 400, 'username is invalid', null);
            // }
            if ( accessUser.accessUserRight !== 0 ) {
                return callback(41716, 'invalid right', 403, 'you have not enough permission', null);
            }
            console.log(accessUser);
            console.log(customerData);
            return  Customer.create({
                customerId: uuidv1(),
                displayName: customerData.displayName ? customerData.displayName : '',
                email: customerData.email,
                birthday: customerData.birthday,
                address: customerData.address ? customerData.displayName : ''
            }).then( (customer) => {
                return callback(null,null,200, customer);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    getAll: function(accessUser, queryContent, callback){
        try {
            console.log(accessUser.accessUserRight);
            if (accessUser.accessUserRight !== 0) {
                return callback(41716, 'invalid right', 403, 'you have no right to access these information', null);
            }

            var condition = {};

            // if( queryContent.q ){
            //     condition = {$text: {$search: queryContent.q}};
            // }
console.log(condition);
            const customers = Customer.findAll().then(listCustomer => {
                return callback(null,null,200, null, listCustomer);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
