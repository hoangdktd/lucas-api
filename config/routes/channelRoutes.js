const channelRoutes = {
    'POST /': 'channelController.createChannel',
    'GET /': 'channelController.getAll',
    'PUT /:id': 'channelController.updateChannel',
    'GET /:id': 'channelController.getOne',
    'DELETE /:id': 'channelController.deleteChannel'
};

module.exports = channelRoutes;