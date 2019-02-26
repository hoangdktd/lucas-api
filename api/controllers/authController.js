const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const JWTService = require('../services/auth.service');
const masterKey = oConstant.masterKey
const userTypeList = oConstant.userTypeList

const AuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    console.log('CREATE NEW ADMIN');
    console.log('user id ========    ' + body.id);
    console.log('displayName ========    ' + body.displayName);
    console.log('password ========    ' + body.password);
    //Check create admin by masterkey
    if (body.masterKey != masterKey){
        return oRest.sendError(res, 400, "You need masterkey to create admin", 400);
    }
    body.userRole = 0
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
              const token = authService().issue({ id: returnUser.id, role: returnUser.userRole });
              return oRest.sendSuccess(res, {token: token, user: returnUser}, httpCode);
            }
          )
        }
        else {
          return oRest.sendError(res, 400, "User is already exits", 400);
        }
      }
    );
  };

  const login = async (req, res) => {
    const { body } = req;
    console.log('user id ========    ' + body.id);
    console.log('password ========    ' + body.password);
    await userManager.get(
      body,
      function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        if ((bcryptService().comparePassword(body.password, returnUser.password))){
          const token = authService().issue({ id: returnUser.id, role: returnUser.userRole }); // need check jwt hoangdktd
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