const User = require('../models/Category');
const categoryManager = require('../managers/CategoryManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');

const categoryController = () => {
  const createCategory = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    console.log(body.address);
    await categoryManager.create(
        {
          name: body.name
        },
        function (errorCode, errorMessage, httpCode, returnCategoryModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnCategoryModel.name;
            oResData.id = returnCategoryModel.id;
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const updateCategory = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await categoryManager.update(
        {
          id: body.id,
          name: body.name
        },
        function (errorCode, errorMessage, httpCode, returnCategoryModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnCategoryModel.name;
            oResData.id = returnCategoryModel.id;
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
    await categoryManager.getOne( queryContent, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, results, httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInCategoryColumn, oConstant.searchFieldInCategoryColumn);
    await categoryManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, {
          data: results,
          total: results.length
        }, httpCode);
    });
  };
  const deleteCategory = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const id = req.params.id || req.query.id || '';
    await categoryManager.delete(
        {
          id: id
        },
        function (errorCode, errorMessage, httpCode, returnCategoryModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'category is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  return {
    createCategory,
    updateCategory,
    getOne,
    getAll,
    deleteCategory
  };
};

module.exports = categoryController;