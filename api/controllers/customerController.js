const User = require('../models/Customer');
const customerManager = require('../managers/CustomerManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

const customerController = () => {
  const createCustomer = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    await customerManager.create(
        {
          accessUserRight: role,
        },{
          displayName: body.displayName,
          email: body.email,
          birthday: body.birthday,
          address: body.address
        },
        function (errorCode, errorMessage, httpCode, returnCustomerModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.displayName = returnCustomerModel.displayName;
            oResData.customerId = returnCustomerModel.customerId;
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const getAll = async (req, res) => {
    var accessUserId = req.query.accessUserId || '';
    var accessUserRight = req.query.accessUserRight || '';
    var queryContent = req.query || '';
    // const role = body.token.role;
    const role = 0;
    console.log(queryContent);
    await customerManager.getAll({
      accessUserRight: role,
      }, queryContent, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, {
          data: results,
          total: results.length
        }, httpCode);
    });
  };
  return {
    createCustomer,
    getAll
  };
};

module.exports = customerController;