// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Customer = require('../models/Customer');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
//     create: async (accessUser, customerData, callback) => {
//         try {
//             // console.log(!oValidator.isAlphanumeric(customerData.displayName));
//             console.log(accessUser.accessUserRight);
//             // if (!oValidator.isAlphanumeric(customerData.displayName)){
//             //     return callback(4178, 'invalid data', 400, 'username is invalid', null);
//             // }
//             if ( accessUser.accessUserRight !== 0 ) {
//                 return callback(41716, 'invalid right', 403, 'you have not enough permission', null);
//             }
//             console.log(accessUser);
//             console.log(customerData);
//             return  Customer.create({
//                 customerId: uuidv1(),
//                 displayName: customerData.displayName ? customerData.displayName : '',
//                 email: customerData.email,
//                 birthday: customerData.birthday,
//                 address: customerData.address ? customerData.displayName : ''
//             }).then( (customer) => {
//                 return callback(null,null,200, customer);
//             });
//         } catch (err) {
//             return callback(521, 'system', 500, null);
//         }
//     },
//     getAll: function(accessUser, queryContent, callback){
//         try {
//             console.log(accessUser.accessUserRight);
//             if (accessUser.accessUserRight !== 0) {
//                 return callback(41716, 'invalid right', 403, 'you have no right to access these information', null);
//             }

//             var condition = {};

//             // if( queryContent.q ){
//             //     condition = {$text: {$search: queryContent.q}};
//             // }
// console.log(condition);
//             const customers = Customer.findAll().then(listCustomer => {
//                 return callback(null,null,200, null, listCustomer);
//             });
//         }catch(error){
//             return callback(5170, 'system', 500, error, null);
//         }
//     },
    get: async (param, callback) => {
        try {
            const customer = await Customer.findOne({
                where: {
                    costumerId: param.costumerId,
                },
            });

            if(!customer) {
                return callback(400, 'Bad Request: User not found', 400, null);
            }

            return callback(null,null,200, customer);
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }
    },
    create: async(params, callback) => {
        try {
            const customer = await Customer.create({
                customerId: params.customerId,
                displayName: params.displayName ? params.displayName : '',
                email: params.email,
                birthday: params.birthday,
                address: params.address ? params.displayName : ''
            });

            if(!customer) {
                return callback(400, 'CustomerId is duplicated', 400, null);
            }
            return callback(null,null,200, customer);
        } catch (err) {
            console.log(err);
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    update: async(params, callback) => {
        try {
            let customer = await params.customer.update({
                email : params.body.email,
                displayName: params.body.displayNamel,
                birthday: params.body.birthday,
                address: params.body.address
            });
            if(!customer) {
                return callback(400, 'Server error', 400, null);
            }
            return callback(null,null,200, customer);
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },

    delete: async(param, callback) => {
        try {
            rowdeleted =  await Customer.destroy({
                where: {
                costumerId: param.costumerId //this will be your id that you want to delete
                }
            });
            if (rowdeleted > 0){
                return callback(null,'Delete Success',200, null);
            } else {
                return callback(400, 'User not found', 400, null);
            }
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },

    getAll: async (params, callback) => {
        try {
          const customers = await Customer.findAll(params);
          return callback(null,null,200, customers);
        //   return res.status(200).json({ users });
        } catch (err) {
          console.log(err); 
          return callback(500, 'Internal server error', 500, null);
        //   return res.status(500).json({ msg: 'Internal server error' });
        }
    }
};
