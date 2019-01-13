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
    await customerManager.create(
        body,
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
  }

  const updateCustomer = async (req, res) => {
    const { body } = req;
    const { params } = req;
    console.log('Backend recieve API UPDATE USER: ');
    console.log('userId ========    ' + params.userId);
    await customerManager.get(
      params,
      async function (errorCode, errorMessage, httpCode, customer) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        };
        await customerManager.update(
          { customer: customer, body: body},
          function (errorCode, errorMessage, httpCode, returnCustomer) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            };
            return oRest.sendSuccess(res, {data: returnCustomer}, httpCode);
          }
        );
      }
    )  
  }

  const deleteCustomer = async (req, res) => {
    const { body } = req;
    const { params } = req;
    const { token } = req;
    console.log(req);
    console.log('Backend recieve API DELETE CUSTIMER: ');
    console.log('customerId ========    ' + params.customerId);

    if (token.role > 0) {
      return res.status(400).json({  msg: 'Only admin can delete new customers' });
    }
    await customerManager.delete(
      params,
      function (errorCode, errorMessage, httpCode, returnData) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        return oRest.sendSuccess(res, {}, httpCode);
      }
    )
  }

  const getOne = async (req, res) => {
    const { params } = req;
    await customerManager.get(
      params,
      function (errorCode, errorMessage, httpCode, returnCustomer) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode);
        }
        return oRest.sendSuccess(res, { data: returnCustomer}, httpCode);
      }
    )
  }

  const getAll = async (req, res) => {
    // var accessUserId = req.query.accessUserId || '';
    // var accessUserRight = req.query.accessUserRight || '';
    // var queryContent = req.query || '';
    // const role = body.token.role;
    // const role = 0;
    // console.log(queryContent);
    const { params } = req;
    const {query} = req;
    attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInCustomerColumn, oConstant.searchFieldInCustomerColumn);
    await customerManager.getAll(
      attr,
      function (errorCode, errorMessage, httpCode, customers) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, {
          data: customers,
          total: customers.length
        }, httpCode);
      }
    );
  }
  return {
    createCustomer,
    getAll,
    deleteCustomer,
    getOne
  };
};

module.exports = customerController;