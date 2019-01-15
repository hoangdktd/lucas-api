const User = require('../models/Customer');
const customerManager = require('../managers/CustomerManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');

const customerController = () => {
  const createCustomer = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    console.log(body.address);
    await customerManager.create(
        {
          displayName: body.displayName,
          email: body.email,
          birthday: body.birthday,
          address: body.address,
          customerId: body.customerId
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
  const updateCustomer = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await customerManager.update(
        {
          id: body.id,
          displayName: body.displayName,
          email: body.email,
          birthday: body.birthday,
          address: body.address,
          customerId: body.customerId
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
  const getOne = async (req, res) => {
    console.log('get one');
    const id = req.params.id || req.query.id || '';
    // const role = req.body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const queryContent = {
      id: id
    }
    await customerManager.getOne( queryContent, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        // return oRest.sendSuccess(res, {
        //   data: results,
        // }, httpCode);
        return oRest.sendSuccess(res, results, httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInCustomerColumn, oConstant.searchFieldInCustomerColumn);
    await customerManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, {
          data: results,
          total: results.length
        }, httpCode);
    });
  };
  const deleteCustomer = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const id = req.params.id || req.query.id || '';
    await customerManager.delete(
        {
          id: id
        },
        function (errorCode, errorMessage, httpCode, returnCustomerModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'customer is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  return {
    createCustomer,
    updateCustomer,
    getOne,
    getAll,
    deleteCustomer
  };
};

module.exports = customerController;