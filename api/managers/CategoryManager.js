// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Category = require('../models/Category');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (categoryData, callback) => {
        try {
            return  Category.create({
                name: categoryData.name ? categoryData.name : '',
                isDelete: false
            }).then( (category) => {
                return callback(null,null,200, category);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            const resultCategory = await Category.findOne({
                where: {
                    id: params.id,
                    isDelete: false
                },
            }).then( category => {
                category.updateAttributes({
                    name : params.name
                }).then( category => {
                    return callback(null,null,200, category);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    getOne: async (queryContent, callback) =>{
        try {
            const category = await Category.findById(queryContent.id);

            if(!category) {
                return callback(400, 'Bad Request: User not found', 400, null, null);
            }

            return callback(null,null,200, null, category);
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
    getAll: function( queryContent, callback){
        try {
            const categories = Category.findAll(queryContent).then(listCategory => {
                return callback(null,null,200, null, listCategory);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            const resultCategory = Category.findOne({
                where: {
                    id: params.id,
                },
            }).then( category => {
                category.updateAttributes({
                    isDelete : true
                }).then( category => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
};
