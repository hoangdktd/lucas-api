// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Product = require('../models/Product');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (productData, callback) => {
        try {
            return  Product.create({
                name: productData.name ? productData.name : '',
                price: productData.price ? productData.price : 0,
                description: productData.description ? productData.description : '',
                stock: productData.stock ? productData.stock : 0,
                link: productData.link ? productData.link : '',
                isDelete: false
            }).then( (product) => {
                return callback(null,null,200, product);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            const resultProduct = await Product.findOne({
                where: {
                    id: params.id,
                    isDelete: false
                },
            }).then( product => {
                product.updateAttributes({
                    name: params.name ? params.name : product.name,
                    price: params.price ? params.price : product.price,
                    description: params.description ? params.description : product.description,
                    stock: params.stock ? params.stock : product.stock,
                    link: params.link ? params.link : product.link,
                }).then( product => {
                    return callback(null,null,200, product);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    getOne: async (queryContent, callback) =>{
        try {
            const product = await Product.findById(queryContent.id);

            if(!product) {
                return callback(400, 'Bad Request: User not found', 400, null, null);
            }

            return callback(null,null,200, null, product);
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
    getAll: function( queryContent, callback){
        try {
            const products = Product.findAll(queryContent).then(listProduct => {
                return callback(null,null,200, null, listProduct);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            const resultProduct = Product.findOne({
                where: {
                    id: params.id,
                },
            }).then( product => {
                product.updateAttributes({
                    isDelete : true
                }).then( product => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
