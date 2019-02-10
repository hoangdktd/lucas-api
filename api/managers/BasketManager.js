const Sequelize = require('sequelize');
const Basket = require('../models/Basket');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (basketData, callback) => {
        try {
            return  Basket.create({
                orderId: basketData.orderId,
                productId: basketData.productId,
                quantity: basketData.quantity,
                isDelete: false
            }).then( (basket) => {
                return callback(null,null,200, basket);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(basketData, callback) => {
        try {
            const resultBasket = await Basket.findOne({
                where: {
                    orderId: basketData.orderId,
                    productId: basketData.productId,
                    isDelete: false
                },
            }).then( basket => {
                basket.updateAttributes({
                    orderId: basketData.orderId,
                    productId: basketData.productId,
                    quantity: basketData.quantity,
                }).then( basket => {
                    return callback(null,null,200, basket);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    getOne: function( basketData, callback){
        try {
            const resultBasket = await Basket.findOne({
                where: {
                    orderId: basketData.orderId,
                    productId: basketData.productId,
                    isDelete: false
                },
            }).then( basket => {
                return callback(null,null,200, null, basket);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( basketData, callback){
        try {
            const resultBasket = Basket.findOne({
                where: {
                    orderId: basketData.orderId,
                    productId: basketData.productId,
                },
            }).then( basket => {
                basket.updateAttributes({
                    isDelete : true
                }).then( basket => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
