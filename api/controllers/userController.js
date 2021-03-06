const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const bcryptService = require('../services/bcrypt.service');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');

const UserController = () => {

  const createUser = async (req, res) => {
    const { body } = req;
    const { token } = req;
    console.log('CREATE NEW USER');
    console.log('userId ========    ' + body.id);
    console.log('displayName ========    ' + body.displayName);
    console.log('password ========    ' + body.password);
    console.log('role number ========    ' + body.userRole);
    console.log(token);
    //Check create admin by masterkey
    if (token.role > oConstant.userRoleUser) {
        return res.status(400).json({  msg: 'Only admin can create new user' });
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
              let oResData = editUserBecomeSend(returnUser);
              oResData.token = authService().issue({ userId: returnUser.userId, role: returnUser.userRole });
              return oRest.sendSuccess(res, oResData, httpCode);
            }
          )
        } else {
          return oRest.sendError(res, 400, "User is already exits", 400);
        }
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
            let oResData = editUserBecomeSend(returnUser);
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
    console.log('Backend recieve API DELETE USER: ');
    console.log('userId ========    ' + params.id);

    if (token.role > 0) {
      return oRest.sendError(res, 400, "Only admin can delete user", 400);
    }
    const id = params.id || req.query.id || '';
    await userManager.delete(
      {
        id: id
      },
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
    console.log('Backend recieve API CHANGE PASS USER: ');
    console.log(params)
    console.log('userId ========    ' + params.id);
    await userManager.get(
      params,
      async function (errorCode, errorMessage, httpCode, returnUser) {
        console.log("get user")
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        if ((bcryptService().comparePassword(body.password, returnUser.password))){
          returnUser.password = body.newPassword;
          returnUser.password = bcryptService().password(returnUser);
          await userManager.update(
            { user: returnUser, body: returnUser},
            function (errorCode, errorMessage, httpCode, returnNewUser) {
              if (errorCode) {
                  return oRest.sendError(res, errorCode, errorMessage, httpCode);
              }
              let oResData = editUserBecomeSend(returnNewUser);
              oResData.token = authService().issue({ userId: returnNewUser.userId, role: returnNewUser.userRole });
              return oRest.sendSuccess(res, oResData, httpCode);
            }
          );
        } else {
          return oRest.sendError(res, 400, "Wrong password", 400);
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
        let oResData = editUserBecomeSend(returnUser);
        //oResData.token = authService().issue({ userId: returnUser.id, role: returnUser.userRole });
        return oRest.sendSuccess(res, returnUser, httpCode);
      }
    )
  }

  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInUserColumn, oConstant.searchFieldInUserColumn, oConstant.sortFieldInUserColumn);
    await userManager.getAll(
      attr,
      function (errorCode, errorMessage, httpCode, users) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        usersList = []
        for (i = 0; i < users.rows.length; i++) {
          usersList.push(editUserBecomeSend(users.rows[i]))
        }
        return oRest.sendSuccess(res, {
          data: usersList, total: users.count
        }, httpCode);
      }
    )
  };

  const deleteManyUser = async (req, res) => {
    const {body} = req;
    console.log(body)
    await userManager.deleteMany(
        body,
        function (errorCode, errorMessage, httpCode, returnOrderModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'users is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };

  return {
    update,
    deleteUser,
    changePassword,
    getOne,
    getAll,
    createUser,
    deleteManyUser
  };
};

const editUserBecomeSend = (user) =>{
  data = {};
  data.id = user.id;
  data.email = user.email;
  data.userType = user.userType;
  data.displayName = user.displayName;
  data.userRole = user.userRole;
  data.updatedAt = user.updatedAt;
  data.createdAt = user.createdAt;
  return data
}
module.exports = UserController;