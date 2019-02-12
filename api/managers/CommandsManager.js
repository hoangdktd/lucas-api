// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Commands = require('../models/Commands');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (commandsData, callback) => {
        try {
            return  Commands.create({
                orderDate: commandsData.orderDate ? commandsData.orderDate : '',
                finishedDate: commandsData.finishedDate ? commandsData.finishedDate : '',
                customerIdentity: commandsData.customerIdentity ? commandsData.customerIdentity : '',
                totalPrice: commandsData.totalPrice ? commandsData.totalPrice : '',
                totalProduct: commandsData.totalProduct ? commandsData.totalProduct : '',
                status: commandsData.status ? commandsData.status : '',
                saleId: commandsData.saleId ? commandsData.saleId : '',
                isDelete: false
            }).then( (commands) => {
                return callback(null,null,200, commands);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            const resultCommands = await Commands.findOne({
                where: {
                    id: params.id,
                    isDelete: false
                },
            }).then( commands => {
                commands.updateAttributes({
                    orderDate: params.orderDate ? params.orderDate : commands.orderDate,
                    finishedDate: params.finishedDate ? params.finishedDate : commands.finishedDate ,
                    customerIdentity: params.customerIdentity ? params.customerIdentity : commands.customerIdentity,
                    totalPrice: params.totalPrice ? params.totalPrice : commands.totalPrice,
                    totalProduct: params.totalProduct ? params.totalProduct : commands.totalProduct,
                    status: params.status ? params.status : commands.status,
                    saleId: params.saleId ? params.saleId : commands.saleId,
                }).then( commands => {
                    return callback(null,null,200, commands);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    getOne: async (queryContent, callback) =>{
        try {
            const commands = await Commands.findById(queryContent.id);

            if(!commands) {
                return callback(400, 'Bad Request: User not found', 400, null, null);
            }

            return callback(null,null,200, null, commands);
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
    getAll: function( queryContent, callback){
        try {
            const categories = Commands.findAll(queryContent).then(listCommands => {
                return callback(null,null,200, null, listCommands);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            const resultCommands = Commands.findOne({
                where: {
                    id: params.id,
                },
            }).then( commands => {
                commands.updateAttributes({
                    isDelete : true
                }).then( commands => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
