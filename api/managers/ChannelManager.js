// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Channel = require('../models/Channel');
const uuidv1 = require('uuid/v1');
const oValidator = require('validator');
const oConstant = require('../utils/constant');

module.exports = {
    create: async (channelData, callback) => {
        try {
            return  Channel.create({
                id: channelData.id,
                isDelete: false
            }).then( (channel) => {
                return callback(null,null,200, channel);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    },
    update: async(params, callback) => {
        try {
            const resultChannel = await Channel.findOne({
                where: {
                    id: params.id,
                    isDelete: false
                },
            }).then( channel => {
                channel.updateAttributes({
                    id : params.id
                }).then( channel => {
                    return callback(null,null,200, channel);
                });
            });
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    get: async (params, callback) =>{
        try {
            const channel = await Channel.findById(params.id);

            if(!channel) {
                return callback(400, 'Bad Request: User not found', 400, null, null);
            }

            return callback(null,null,200, null, channel);
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },
    getAll: function( queryContent, callback){
        try {
            const categories = Channel.findAndCountAll(queryContent).then(listChannel => {
                return callback(null,null,200, null, listChannel);
            });
        }catch(error){
            return callback(5170, 'system', 500, error, null);
        }
    },

    delete: async function( params, callback){
        try {
            const resultChannel = Channel.findById(params.id).then( channel => {
                channel.updateAttributes({
                    isDelete : true
                }).then( channel => {
                    return callback(null,null,200, null);
                });
            });
        }catch(error){
            console.log(error)
            return callback(5170, 'system', 500, error, null);
        }
    },
};
