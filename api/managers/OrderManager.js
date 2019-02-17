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
            if (orderData.idPackage && orderData.numberPackage > 0) {
                console.log('isPackageIdUnique');
                console.log(orderData.idPackage);

                const resultOrder = await Order.findOne({
                    where: {
                        idPackage: orderData.idPackage,
                        isDelete: false
                    },
                }).then( order => {
                    if(!order) {
                        return Order.sequelize.transaction(function (t) {
                            console.log('start transaction');
                            const orderPromises = [];
                            for (let i = 0; i < orderData.numberPackage; i++) {
                                const newPromise = Order.create({
                                    status: orderData.status,
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
                                    packageOrder: i+1,
                                    isDelete: false
                                }, {transaction: t});
                                orderPromises.push(newPromise);
                            }
                            return Promise.all(orderPromises);
                        }).then(function (result) {
                            return callback(null,null,200, result);
                        }).catch(function (err) {
                            return callback(400, 'fail transaction', 400, null);
                        });
                    } else {
                        return callback(462,'already has package id', 400, null);
                    }
                });




                // return Order.Profile.count({ where: { idPackage: orderData.idPackage, isDelete: false } })
                // .then(count => {
                //     console.log('count');
                //     console.log(count);
                //     if (count != 0) {
                //         return callback(462,'already has package id', 400, null);
                //     }
                //     return Order.sequelize.transaction(function (t) {
                //         console.log('start transaction');
                //         const orderPromises = [];
                //         for (let i = 0; i < orderData.numberPackage; i++) {
                //             const newPromise = Order.create({
                //                 status: orderData.status,
                //                 customerIdentity: orderData.customerIdentity,
                //                 saleId: orderData.saleId,
                //                 channel: orderData.channel,
                //                 createDate: orderData.createDate,
                //                 finishedDate: orderData.finishedDate,
                //                 priceOrder: orderData.priceOrder,
                //                 note: orderData.note,
                //                 infoOrderLink: orderData.infoOrderLink,
                //                 backupOrderLink: orderData.backupOrderLink,
                //                 paymentStatus: orderData.paymentStatus,
                //                 designerId: orderData.designerId,
                //                 typeDesigner: orderData.typeDesigner,
                //                 idPackage: orderData.idPackage,
                //                 numberPackage: orderData.numberPackage,
                //                 packageOrder: i,
                //                 isDelete: false
                //             }, {transaction: t});
                //             orderPromises.push(newPromise);
                //         }
                //         return Promise.all(orderPromises);
                //     }).then(function (result) {
                //         return callback(null,null,200, result);
                //     }).catch(function (err) {
                //         return callback(400, 'fail transaction', 400, null);
                //     });
                // });
            } else {
                return  Order.create({
                    status: orderData.status,
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
            }
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
            const orders = Order.findAndCountAll(queryContent).then(listOrder => {
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

    isPackageIdUnique: function (idPackage) {
        console.log('isPackageIdUnique11111');
        return Order.Profile.count({ where: { idPackage: idPackage, isDelete: false } })
          .then(count => {
            if (count != 0) {
                Order.Profile
              return false;
            }
            return true;
        });
    }
};
