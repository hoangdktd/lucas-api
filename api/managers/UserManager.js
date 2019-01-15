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

    getUserId: async (param, callback) => {
        try {
            const user = await User.findOne({
                where: {
                    userId: param.userId,
                },
            });

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
            const user = await User.create({
                email: params.email,
                userId: params.userId,
                userType: params.userType,
                displayName: params.displayName,
                password : params.password,
                userRole: params.userRole,
                userType : userTypeList[params.userRole]
            });

            if(!user) {
                return callback(400, 'Server error', 400, null);
            }
            return callback(null,null,200, user);
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },
    update: async(params, callback) => {
        try {
            let user = await params.user.update({
                userId: params.body.userId,
                email : params.body.email,
                userType : params.body.userType,
                displayName :  params.body.displayName,
                userRole : params.body.userRole,
                userType : userTypeList[params.body.userRole]
            });
            if(!user) {
                return callback(400, 'Cannot update user, duplicated userId', 400, null);
            }
            return callback(null,null,200, user);
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },

    delete: async(param, callback) => {
        try {
            rowdeleted =  await User.destroy({
                where: {
                id: param.id //this will be your id that you want to delete
                }
            });
            if (rowdeleted > 0){
                return callback(null,'Delete Success',200, null);
            } else {
                return callback(400, 'User not found', 400, null);
            }
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }

    },

    getAll: async (params, callback) => {
        try {
          const users = await User.findAll(params);
          return callback(null,null,200, users);
        //   return res.status(200).json({ users });
        } catch (err) {
          console.log(err); 
          return callback(500, 'Internal server error', 500, null);
        //   return res.status(500).json({ msg: 'Internal server error' });
        }
    }

};
