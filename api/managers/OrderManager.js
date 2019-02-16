// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Order = require('../models/Order');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (orderData, callback) => {
        try {
            return  Order.create({
                status: oConstant.orderStatusEnum[0],
                customerIdentity: orderData.customerIdentity,
                saleId: orderData.saleId,
                channel: orderData.channel,
                createDate: orderData.createDate,
                finishedDate: orderData.finishedDate,
                priceOrder: orderData.priceOrder,
                note: orderData.note,
                infoOrderLink: orderData.infoOrderLink,
                backupOrderLink: orderData.backupOrderLink,
                paymentStatus: orderData.paymentStatus,
                designerId: orderData.designerId,
                typeDesigner: orderData.typeDesigner,
                idPackage: orderData.idPackage,
                numberPackage: orderData.numberPackage,
                isDelete: false
            }).then( (order) => {
                return callback(null,null,200, order);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            const resultOrder = await Order.findOne({
                where: {
                    id: params.id,
                    isDelete: false
                },
            }).then( order => {
                return order.updateAttributes({
                    status: params.status,
                    customerIdentity: params.customerIdentity,
                    saleId: params.saleId,
                    channel: params.channel,
                    createDate: params.createDate,
                    finishedDate: params.finishedDate,
                    priceOrder: params.priceOrder,
                    note: params.note,
                    infoOrderLink: params.infoOrderLink,
                    backupOrderLink: params.backupOrderLink,
                    paymentStatus: params.paymentStatus,
                    designerId: params.designerId,
                    typeDesigner: params.typeDesigner,
                    idPackage: params.idPackage,
                    numberPackage: params.numberPackage
                }).then( order => {
                    return callback(null,null,200, order);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    getOne: async (queryContent, callback) =>{
        try {
            const order = await Order.findById(queryContent.id);

            if(!order) {
                return callback(400, 'Bad Request: User not found', 400, null, null);
            }

            return callback(null,null,200, null, order);
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
    getAll: function( queryContent, callback){
        try {
            const orders = Order.findAll(queryContent).then(listOrder => {
                return callback(null,null,200, null, listOrder);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            const resultOrder = Order.findOne({
                where: {
                    id: params.id,
                },
            }).then( order => {
                order.updateAttributes({
                    isDelete : true
                }).then( order => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
