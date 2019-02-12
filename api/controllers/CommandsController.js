const User = require('../models/Commands');
const commandsManager = require('../managers/CommandsManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');

const commandsController = () => {
  const createCommands = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    console.log(body.address);
    await commandsManager.create(
        {
          name: body.name
        },
        function (errorCode, errorMessage, httpCode, returnCommandsModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnCommandsModel.name;
            oResData.id = returnCommandsModel.id;
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  const updateCommands = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await commandsManager.update(
        {
          id: body.id,
          name: body.name
        },
        function (errorCode, errorMessage, httpCode, returnCommandsModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnCommandsModel.name;
            oResData.id = returnCommandsModel.id;
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
    await commandsManager.getOne( queryContent, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, results, httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInCommandsColumn, oConstant.searchFieldInCommandsColumn);
    await commandsManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, {
          data: results,
          total: results ? results.length : 0
        }, httpCode);
    });
  };
  const deleteCommands = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    // const role = body.token.role;
    const role = 0;
    if (role !== 0) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const id = req.params.id || req.query.id || '';
    await commandsManager.delete(
        {
          id: id
        },
        function (errorCode, errorMessage, httpCode, returnCommandsModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'commands is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  return {
    createCommands,
    updateCommands,
    getOne,
    getAll,
    deleteCommands
  };
};

module.exports = commandsController;