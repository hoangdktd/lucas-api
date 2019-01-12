const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const bcryptService = require('../services/bcrypt.service');

let userTypeList = ['admin', 'saler', 'deliver', 'designer']

const UserController = () => {

  const createUser = async (req, res) => {
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
              oResData.user = returnUser;
              oResData.token = authService().issue({ userId: returnUser.userId, role: returnUser.userRole });
              return oRest.sendSuccess(res, oResData, httpCode);
            }
          )
        }
        return res.status(400).json({  msg: 'You is already exist' });
      }
    );
  };

  const update = async (req, res) => {
    const { body } = req;
    const { params } = req;
    console.log('Backend recieve API UPDATE USER: ');
    console.log('userId ========    ' + params.userId);
    await userManager.get(
      params,
      async function (errorCode, errorMessage, httpCode, user) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        };
        await userManager.update(
          { user: user, body: body},
          function (errorCode, errorMessage, httpCode, returnUser) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            let oResData = {};
            oResData.user = returnUser;
            oResData.token = authService().issue({ userId: returnUser.userId, role: returnUser.userRole });
            return oRest.sendSuccess(res, oResData, httpCode);
          }
        );
      }
    )  
  }
 
  const deleteUser = async (req, res) => {
    const { body } = req;
    const { params } = req;
    const { token } = req;
    console.log(req);
    console.log('Backend recieve API DELETE USER: ');
    console.log('userId ========    ' + params.userId);

    if (token.role > 0) {
      return res.status(400).json({  msg: 'Only admin can delete new user' });
    }
    await userManager.delete(
      params,
      function (errorCode, errorMessage, httpCode, returnData) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        let oResData = {}; 
        return oRest.sendSuccess(res, oResData, httpCode);
      }
    )
  }

  const changePassword = async (req, res) => {
    const { body } = req;
    const { params } = req;
    const token  = req.header('X-Access-Token');
    console.log(req);
    console.log('Backend recieve API CHANGE PASS USER: ');
    console.log('userId ========    ' + params.userId);
    await userManager.get(
      params,
      async function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        if ((bcryptService().comparePassword(body.oldPassword, returnUser.password))){
          returnUser.password = body.newPassword;
          returnUser.password = bcryptService().password(returnUser);
          await userManager.update(
            returnUser,
            function (errorCode, errorMessage, httpCode, returnNewUser) {
              if (errorCode) {
                  return oRest.sendError(res, errorCode, errorMessage, httpCode);
              }
              let oResData = {};
              oResData.user = returnNewUser;
              oResData.token = authService().issue({ userId: returnNewUser.userId, role: returnNewUser.userRole });
              return oRest.sendSuccess(res, oResData, httpCode);
            }
          );
        } 
      }
    )
  }
  const getOne = async (req, res) => {
    const { params } = req;
    await userManager.get(
      params,
      function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        const token = authService().issue({ userId: returnUser.id, role: returnUser.userRole }); // need check jwt hoangdktd
        let oResData = {};
        oResData.token = token;
        oResData.user = returnUser;
        return oRest.sendSuccess(res, oResData, httpCode);
      }
    )
  }

  const getAll = async (req, res) => {
    const { params } = req;
    await userManager.getAll(
      params,
      function (errorCode, errorMessage, httpCode, users) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        return oRest.sendSuccess(res, {data: users, total: users.length}, httpCode);
      }
    )
  }
  return {
    update,
    deleteUser,
    changePassword,
    getOne,
    getAll,
    createUser
  };
};

module.exports = UserController;