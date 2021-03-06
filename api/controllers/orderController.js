const User = require('../models/Order');
const orderManager = require('../managers/OrderManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');

const orderController = () => {
  const createOrder = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await orderManager.create(
        {
            status: body.status,
            customerId: body.customerId,
            saleId: body.saleId,
            channelId: body.channelId,
            createDate: body.createDate,
            finishedDate: body.finishedDate,
            priceOrder: body.priceOrder,
            note: body.note,
            infoOrderLink: body.infoOrderLink,
            backupOrderLink: body.backupOrderLink,
            paymentStatus: body.paymentStatus,
            designerId: body.designerId,
            typeDesigner: body.typeDesigner,
            idPackage: body.idPackage,
            numberPackage: body.numberPackage,
        },
        function (errorCode, errorMessage, httpCode, returnOrderModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            // var oResData = {};
            return oRest.sendSuccess(res, editOrderBecomeSend(returnOrderModel), httpCode);
        }
    );
  };
  const updateOrder = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await orderManager.update(
        {
            id: body.id,
            status: body.status,
            customerId: body.customerId,
            saleId: body.saleId,
            channelId: body.channelId,
            createDate: body.createDate,
            finishedDate: body.finishedDate,
            priceOrder: body.priceOrder,
            note: body.note,
            infoOrderLink: body.infoOrderLink,
            backupOrderLink: body.backupOrderLink,
            paymentStatus: body.paymentStatus,
            designerId: body.designerId,
            typeDesigner: body.typeDesigner,
            idPackage: body.idPackage,
            numberPackage: body.numberPackage,
        },
        function (errorCode, errorMessage, httpCode, returnOrderModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, editOrderBecomeSend(returnOrderModel), httpCode);
        }
    );
  };
  const getOne = async (req, res) => {
    const id = req.params.id || req.query.id || '';
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await orderManager.get( id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, editOrderBecomeSend(result), httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInOrderColumn, oConstant.searchFieldInOrderColumn, oConstant.sortFieldInOrderColumn);
    await orderManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        listOrder = [];
        for (i = 0; i< results.rows.length; i++) {
            listOrder.push(editOrderBecomeSend(results.rows[i]));
        }
        return oRest.sendSuccess(res, {
          data: results.rows,
          total: results.count
        }, httpCode);
    });
  };
  const deleteOrder = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const id = req.params.id || req.query.id || '';
    await orderManager.delete(
        {
          id: id
        },
        function (errorCode, errorMessage, httpCode, returnOrderModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'order is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const deleteManyOrder = async (req, res) => {
    const {body} = req;
    console.log(body)
    await orderManager.deleteMany(
        body,
        function (errorCode, errorMessage, httpCode, returnOrderModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'orders is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  }
  return {
    createOrder,
    updateOrder,
    getOne,
    getAll,
    deleteOrder,
    deleteManyOrder
  };
};

const editOrderBecomeSend = (order) =>{
  order.isDelete = undefined;
  return order;
}

module.exports = orderController;