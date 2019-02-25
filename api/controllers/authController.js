const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

const masterKey = oConstant.masterKey
const userTypeList = oConstant.userTypeList

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
        return oRest.sendError(res, 400, "You need masterkey to create admin", 400);
    } else if (token) {
        if (token.role > 0) {
          return oRest.sendError(res, 400, "Only admin can create new user", 400);
      } else {
        return oRest.sendError(res, 400, "You need add token", 400);
      }
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
              oResData.user = returnUser;
              oResData.token = authService().issue({ userId: returnUser.userId, role: returnUser.userRole });
              return oRest.sendSuccess(res, oResData, httpCode);
            }
          )
        }
        return oRest.sendError(res, 400, "User is already exits", 400);
      }
    );
  };

  const login = async (req, res) => {
    const { body } = req;
    console.log('userId ========    ' + body.userId);
    console.log('password ========    ' + body.password);
    await userManager.getUserId(
      body,
      function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        if ((bcryptService().comparePassword(body.password, returnUser.password))){
          const token = authService().issue({ userId: returnUser.id, role: returnUser.userRole }); // need check jwt hoangdktd
          // let oResData = {};
          // oResData.data = {};
          // oResData.data.token = token;
          // oResData.data.user = returnUser;
          return oRest.sendSuccess(res, {token: token, user: returnUser}, httpCode);
        } else {
            return oRest.sendError(res, 400, "Wrong password", 400);
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