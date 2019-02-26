// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Customer = require('../models/Customer');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (customerData, callback) => {
        try {
            return  Customer.create({
                id: customerData.id,
                displayName: customerData.displayName ? customerData.displayName : '',
                email: customerData.email,
                birthday: customerData.birthday,
                address: customerData.address ? customerData.address : '',
                facebookLink: customerData.facebookLink,
                note: customerData.note,
                channel: customerData.channel,
                totalSpent: 0,
                isDelete: false
            }).then( (customer) => {
                return callback(null,null,200, customer);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            const resultCustomer = await Customer.findById(params.id).then( customer => {
                return customer.updateAttributes({
                    email : params.email,
                    displayName : params.displayName,
                    birthday :  params.birthday,
                    address : params.address,
                    facebookLink: params.facebookLink,
                    note: params.note,
                    channel: params.channel,
                }).then( customer => {
                    return callback(null,null,200, customer);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    getOne: async (queryContent, callback) =>{
        try {
            const customer = await Customer.findById(queryContent.id);

            if(!customer) {
                return callback(400, 'Bad Request: User not found', 400, null, null);
            }

            return callback(null,null,200, null, customer);
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
    getAll: function( queryContent, callback){
        try {
            const customers = Customer.findAndCountAll(queryContent).then(listCustomer => {
                return callback(null,null,200, null, listCustomer);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            const resultCustomer = Customer.findbyId(params.id).then( customer => {
                customer.updateAttributes({
                    isDelete : true
                }).then( customer => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
