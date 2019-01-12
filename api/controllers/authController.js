const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

let userTypeList = ['admin', 'saler', 'deliver', 'designer']
let masterKey = "phamduylaideptrai"

const AuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    const { token } = req;
    console.log('CREATE NEW USER');
    console.log('userId ========    ' + body.userId);
    console.log('displayName ========    ' + body.displayName);
    console.log('password ========    ' + body.password);
    console.log('role number ========    ' + body.userRole);

    //Check create admin by masterkey
    if( body.userRole == 0) {
      if (body.masterKey != masterKey)
        return res.status(400).json({  msg: 'You need masterkey to create admin' });
    } else if (token) {
      if (token.role > 0) {
        return res.status(400).json({  msg: 'Only admin can create new user' });
      }
    } else {
      return res.status(400).json({  msg: 'You need add token' });
    }
    await userManager.get(
      body,
      async function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
          await userManager.create(
            body,
            function (errorCode, errorMessage, httpCode, returnUser) {
              if (errorCode) {
                  return oRest.sendError(res, errorCode, errorMessage, httpCode);
              }
              let oResData = {};
              oResData.data = {};
              oResData.data.user = returnUser;
              oResData.data.token = authService().issue({ userId: returnUser.userId, role: returnUser.userRole });
              return oRest.sendSuccess(res, oResData, httpCode);
            }
          )
        }
        return res.status(400).json({  msg: 'You is already exist' });
      }
    );
  };

  const login = async (req, res) => {
    const { body } = req;
    console.log('userId ========    ' + body.userId);
    console.log('password ========    ' + body.password);
    await userManager.get(
      body,
      function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        if ((bcryptService().comparePassword(body.password, returnUser.password))){
          const token = authService().issue({ userId: returnUser.id, role: returnUser.userRole }); // need check jwt hoangdktd
          let oResData = {};
          oResData.data = {};
          oResData.data.token = token;
          oResData.data.user = returnUser;
          return oRest.sendSuccess(res, oResData, httpCode);
        }
      }
    )
  }
  const getOne = async (req, res) => {
    const { query } = req;
    console.log('userId ========    ' + body.userId);
    console.log('password ========    ' + body.password);
    await userManager.get(
      body,
      function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        if ((bcryptService().comparePassword(body.password, returnUser.password))){
          const token = authService().issue({ userId: returnUser.id, role: returnUser.userRole }); // need check jwt hoangdktd
          let oResData = {};
          oResData.data = {};
          oResData.data.token = token;
          oResData.data.user = returnUser;
          return oRest.sendSuccess(res, oResData, httpCode);
        }
      }
    )
  }
  return {
    register,
    login
  };
};

module.exports = AuthController;