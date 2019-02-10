const productManager = require('../managers/ProductManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');

const productController = () => {
  const createProduct = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }

    await productManager.create(
        {
          name: body.name,
          price: body.price,
          description: body.description,
          stock: body.stock,
          link: body.link,
        },
        function (errorCode, errorMessage, httpCode, returnProductModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnProductModel.name;
            oResData.id = returnProductModel.id;
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const updateProduct = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await productManager.update(
        {
          id: body.id,
          name: body.name,
          price: body.price,
          description: body.description,
          stock: body.stock,
          link: body.link,
        },
        function (errorCode, errorMessage, httpCode, returnProductModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnProductModel.name;
            oResData.id = returnProductModel.id;
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const getOne = async (req, res) => {
    const id = req.params.id || req.query.id || '';
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const queryContent = {
      id: id
    }
    await productManager.getOne( queryContent, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, results, httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInProductColumn, oConstant.searchFieldInProductColumn);
    await productManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, {
          data: results,
          total: results.length
        }, httpCode);
    });
  };
  const deleteProduct = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const id = req.params.id || req.query.id || '';
    await productManager.delete(
        {
          id: id
        },
        function (errorCode, errorMessage, httpCode, returnProductModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'product is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  return {
    createProduct,
    updateProduct,
    getOne,
    getAll,
    deleteProduct
  };
};

module.exports = productController;