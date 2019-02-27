const User = require('../models/User');
const Customer = require('../models/Customer');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const oConstant = require('../utils/constant');

const userTypeList = oConstant.userTypeList

module.exports = {
    get: async (param, callback) => {
        try {
            const user = await User.findById(param.id);
            if(!user) {
                return callback(400, 'Bad Request: User not found', 400, null);
            }

            return callback(null,null,200, user);
        } catch (err) {

            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }
    },

    create: async(params, callback) => {
        try {
            const newUser = await User.create({
                id: params.id,
                email: params.email,
                userType: params.userType,
                displayName: params.displayName,
                password : params.password,
                userRole: params.userRole,
                userType : userTypeList[params.userRole],
                isDelete : false
            });

            if(!newUser) {
                return callback(400, 'Server error', 400, null);
            } else {
                return callback(null,null,200, newUser);
            }
            
        } catch (err) {
            console.log(err);
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    update: async(params, callback) => {
        try {
            let user = await params.user.updateAttributes({
                id: params.body.id,
                email : params.body.email,
                userType : params.body.userType,
                displayName :  params.body.displayName,
                userRole : params.body.userRole,
                userType : userTypeList[params.body.userRole],
                password : params.body.password
            });
            if(!user) {
                return callback(400, 'Cannot update user, duplicated user Id', 400, null);
            }
            return callback(null,null,200, user);
        } catch (err) {
            console.log(err)
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },

    delete: async(param, callback) => {
        try {
            user =  await User.findById(param.id);
            if (!user){
                return callback(null,'User not found',400, null);
            } else {
                userUpdate = await user.updateAttributes({
                    isDelete: true
                });
                if (!userUpdate) {
                    return callback(null,'Server error',400, null);
                } else {
                    return callback(null,'Update sucsses',200, userUpdate);
                }
            }
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },

    getAll: async (params, callback) => {
        try {
          const users = await User.findAndCountAll(params);
          return callback(null,null,200, users);
        //   return res.status(200).json({ users });
        } catch (err) {
          console.log(err); 
          return callback(500, 'Internal server error', 500, null);
        //   return res.status(500).json({ msg: 'Internal server error' });
        }
    },

    deleteMany: async function (params, callback) {
        return User.sequelize.transaction(function (t) {
            console.log('start transaction');
            const userPromises = [];

            for (let i = 0; i < params.length; i++) {
                const newPromise = User.findById(
                    params[i]
                , {transaction: t}).then(function(user) {
                    return user.updateAttributes({
                        isDelete : true
                    }, {transaction: t})
                })
                userPromises.push(newPromise);
            }
            return Promise.all(userPromises).then(function (result) {
                    return callback(null,null,200, result);
            }).catch(function (err) {
                console.log(err);
                return callback(400, 'fail transaction', 400, null);
            });
        })
    },

};
