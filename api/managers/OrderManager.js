// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const User = require('../models/User');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

// Customer.hasMany(Order, {foreignKey: 'id', as: 'customer'});
// User.hasMany(Order, {foreignKey: 'id', as: 'sale'});
// User.hasMany(Order, {foreignKey: 'id', as: 'designer'});
// Order.belongsTo(Customer, {foreignKey: 'customerIdentity', as: 'customer'});
// Order.belongsTo(User, {foreignKey: 'saleId', as: 'sale'});
// Order.belongsTo(User, {foreignKey: 'designerId', as: 'designer'});

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
                                    customerId: orderData.customerId,
                                    saleId: orderData.saleId,
                                    channelId: orderData.channelId,
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
                            return Promise.all(orderPromises).then(function(orders) {
                                let newTotalPrice = 0;
                                let customerId = orders[0].customerId;
                                console.log('newTotalPrice');
                                console.log(newTotalPrice);
                                for (let j = 0; j < orders.length; j++) {
                                    const childOrder = orders[j];
                                    if (childOrder.priceOrder) {
                                        newTotalPrice = parseFloat(newTotalPrice) + parseFloat(childOrder.priceOrder);
                                    }
                                }
                                console.log('newTotalPrice');
                                console.log(newTotalPrice);
                                return Customer.findById(customerId, {transaction: t}).
                                    then((customer) =>{
                                        return customer.updateAttributes({
                                            totalSpent : parseFloat(customer.totalSpent) + parseFloat(newTotalPrice)
                                        }, {transaction: t}).then (function (customer){
                                            return orders
                                        });
                                    }
                                );
                            });
                            return Promise.all(orderPromises);
                        }).then(function (result) {
                            return callback(null,null,200, result);
                        }).catch(function (err) {
                            console.log(err);
                            return callback(400, 'fail transaction', 400, null);
                        });
                    } else {
                        return callback(462,'Package ID is duplicated. Please try again.', 400, null);
                    }
                });
            } else {
                return Order.sequelize.transaction(function (t) {
                    const orderPromises = [];
                    console.log(typeof (orderData.priceOrder));
                    console.log(parseFloat(orderData.priceOrder));
                    return  Order.create({
                        status: orderData.status,
                        customerId: orderData.customerId,
                        saleId: orderData.saleId,
                        channelId: orderData.channelId,
                        createDate: orderData.createDate,
                        finishedDate: orderData.finishedDate,
                        priceOrder: parseFloat(orderData.priceOrder),
                        note: orderData.note,
                        infoOrderLink: orderData.infoOrderLink,
                        backupOrderLink: orderData.backupOrderLink,
                        paymentStatus: orderData.paymentStatus,
                        designerId: orderData.designerId,
                        typeDesigner: orderData.typeDesigner,
                        idPackage: orderData.idPackage,
                        numberPackage: orderData.numberPackage,
                        isDelete: false
                    }, {transaction: t}).then( (order) => {
                        console.log('order.customerId');
                        console.log(order.customerId);
                        return Customer.findById( order.customerId , {transaction: t})
                        .then( (customer) => {
                            console.log(customer);
                                const totalSpent = parseFloat(customer.totalSpent) + parseFloat(order.priceOrder);
                                console.log(parseFloat(totalSpent));
                                return customer.updateAttributes({
                                    totalSpent: parseFloat(totalSpent)
                                }, {transaction: t}).then (function (customer){
                                    return order
                                });
                            });
                        });
                }).then(function (result) {
                    return callback(null,null,200, result);
                }).catch(function (err) {
                    console.log(err);
                    return callback(400, 'fail transaction', 400, null);
                })
            }
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            return Order.sequelize.transaction(function (t) {
                console.log('start transaction');
                return Order.findById(
                params.id
                , {transaction: t}).then(function(orders) {
                    const oldStatus = orders.status;
                    const oldPrice = orders.priceOrder;
                    const oldCustomerId = orders.customerId
                    return orders.updateAttributes({
                        status: params.status,
                        customerId: params.customerId,
                        saleId: params.saleId,
                        channelId: params.channelId,
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
                    }, {transaction: t}).then(function (orders) {
                        let changePrice = 0;
                        if (params.status !== oConstant.orderStatusEnum[3]) {
                            if (oldStatus === oConstant.orderStatusEnum[3]) {
                                changePrice = params.priceOrder ? parseFloat(params.priceOrder) : parseFloat(oldPrice);
                            } else {
                                changePrice = parseFloat(params.priceOrder) - parseFloat(oldPrice);
                            }
                        } else {
                            if (oldStatus !== oConstant.orderStatusEnum[3]) {
                                changePrice = 0 - parseFloat(oldPrice);
                            }
                        }
                        return Customer.findById(orders.customerIdentity, {transaction: t}).
                            then((customer) =>{
                                return customer.updateAttributes({
                                    totalSpent : parseFloat(customer.totalSpent) + parseFloat(changePrice)
                                }, {transaction: t});
                            }
                        );
                    });
                });

            }).then(function (result) {
                // Transaction has been committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return callback(null,null,200, result);
            }).catch(function (err) {
                // Transaction has been rolled back
                // err is whatever rejected the promise chain returned to the transaction callback
                console.log(err);
                return callback(400, 'fail transaction', 400, null);
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
            // queryContent['include'] = ['customer', 'sale', 'designer'];
            const orders = Order.findAndCountAll(queryContent).then(listOrder => {
                return callback(null,null,200, null, listOrder);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            return Order.sequelize.transaction(function (t) {
                console.log('start transaction');
                return Order.findById(
                    params.id
                , {transaction: t}).then(function(orders) {
                    return orders.updateAttributes({
                        isDelete : true
                    }, {transaction: t}).then(function(orders) {
                            return Customer.findById(orders.customerIdentity, {transaction: t}).
                                then((customer) =>{
                                    return customer.updateAttributes({
                                        totalSpent : parseFloat(customer.totalSpent) - parseFloat(order.priceOrder)
                                    });
                                }
                            );
                    });
                });

            }).then(function (result) {
                // Transaction has been committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return callback(null,null,200, result);
            }).catch(function (err) {
                // Transaction has been rolled back
                // err is whatever rejected the promise chain returned to the transaction callback
                return callback(400, 'fail transaction', 400, null);
            });
        } catch (error) {
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
