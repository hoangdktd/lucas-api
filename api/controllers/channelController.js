const Channel = require('../models/Channel');
const channelManager = require('../managers/ChannelManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const extraFuncQuery = require('../extraFunction/createAttrForQuery');
 
const channelController = () => {
  const createChannel = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }

    await channelManager.get(
      body,
      async function (errorCode, errorMessage, httpCode, returnChannel) {
        if (errorCode) {
          await channelManager.create(
            body,
            function (errorCode, errorMessage, httpCode, returnChannel) {
              if (errorCode) {
                  return oRest.sendError(res, errorCode, errorMessage, httpCode);
              }
              return oRest.sendSuccess(res, editChannelBecomeSend(returnChannel), httpCode);
            }
          )
        }
        else {
          return oRest.sendError(res, 400, "Channel id is already exits", 400);
        }
      }
    );

    await channelManager.create(
        {
          id: body.id
        },
        function (errorCode, errorMessage, httpCode, channelReturn) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, editChannelBecomeSend(channelReturn), httpCode);
        }
    );
  };
  const updateChannel = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    await channelManager.update(
        {
          id: body.id,
        },
        function (errorCode, errorMessage, httpCode, returnChannelModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.name = returnChannelModel.name;
            oResData.id = returnChannelModel.id;
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
    await channelManager.get( queryContent, function (errorCode, errorMessage, httpCode, errorDescription, channelReturn) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        return oRest.sendSuccess(res, editChannelBecomeSend(channelReturn), httpCode);
    });
  };
  const getAll = async (req, res) => {
    const { params } = req;
    const {query} = req;
    const attr = extraFuncQuery.filterAndSearch(query, oConstant.filterFieldInChannelColumn, oConstant.searchFieldInChannelColumn);
    await channelManager.getAll( attr, function (errorCode, errorMessage, httpCode, errorDescription, results) {
        if (errorCode) {
            return oRest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        channelList = []
        for (i = 0; i< results.rows.length; i++) {
          channelList.push(editChannelBecomeSend(results.rows[i]));
        }
        return oRest.sendSuccess(res, {
          data: channelList,
          total: results.count
        }, httpCode);
    });
  };
  const deleteChannel = async (req, res) => {
    // body is part of a form-data
    const { body } = req;
    const role = req.token.role;
    if (role > oConstant.userRoleUser) {
      return oRest.sendError(res, 41716, 'invalid right', 403, 'you have no right to access these information');
    }
    const id = req.params.id || req.query.id || '';
    await channelManager.delete(
        {
          id: id
        },
        function (errorCode, errorMessage, httpCode, returnChannelModel) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            var oResData = {};
            oResData.msg = 'channel is deleted';
            return oRest.sendSuccess(res, oResData, httpCode);
        }
    );
  };
  return {
    createChannel,
    updateChannel,
    getOne,
    getAll,
    deleteChannel
  };
};

const editChannelBecomeSend = (channel) =>{
  channel.isDelete = undefined;
  return channel;
}

module.exports = channelController;