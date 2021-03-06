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
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    console.log(body.address);
    await customerManager.get(
      body,
      async function (errorCode, errorMessage, httpCode, returnUser) {
        if (errorCode) {
          await customerManager.create(
              {
                id: body.id,
                displayName: body.displayName,
                email: body.email,
                birthday: body.birthday,
                address: body.address,
                facebookLink: body.facebookLink,
                note: body.note,
                channel: body.channel
              },
              function (errorCode, errorMessage, httpCode, returnCustomerModel) {
                  if (errorCode) {
                      return oRest.sendError(res, errorCode, errorMessage, httpCode);
                  }
                  return oRest.sendSuccess(res, editCustomerBecomeSend(returnCustomerModel), httpCode);
              }
          );
        }
        return oRest.sendError(res, 400, "Customer is already exits", 400);
    })
  };
  const updateCustomer = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await customerManager.update(
        {
          id: body.id,
          displayName: body.displayName,
          email: body.email,
          birthday: body.birthday,
          address: body.address,
          facebookLink: body.facebookLink,
          note: body.note,
          channel: body.channel
        },
        function (errorCode, errorMessage, httpCode, returnCustomerModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.displayName = returnCustomerModel.displayName;
            oResData.id = returnCustomerModel.id;
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const getOne = async (req, res) => {
    const id = req.params.id || req.query.id || '';
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const queryContent = {
      id: id
    }
    await customerManager.get( queryContent, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, editCustomerBecomeSend(result), httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInCustomerColumn, oConstant.searchFieldInCustomerColumn, oConstant.sortFieldInCustomerColumn);
    await customerManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        customerList = [];
        for (i = 0; i< results.rows.length; i++) {
          customerList.push(editCustomerBecomeSend(results.rows[i]))
        }
        return oRest.sendSuccess(res, {
          data: customerList,
          total: results.count
        }, httpCode);
    });
  };
  const deleteCustomer = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
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

  const deleteManyCustomer = async (req, res) => {
    const {body} = req;
    console.log(body)
    await customerManager.deleteMany(
        body,
        function (errorCode, errorMessage, httpCode, returnOrderModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'customers is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };

  return {
    createCustomer,
    updateCustomer,
    getOne,
    getAll,
    deleteCustomer,
    deleteManyCustomer
  };
};

const editCustomerBecomeSend = (customer) =>{
  customer.isDelete = undefined;
  return customer;
}

module.exports = customerController;