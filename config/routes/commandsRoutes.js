const commandsRoutes = {
    'POST /': 'commandsController.createCommands',
    'GET /': 'commandsController.getAll',
    'PUT /:id': 'commandsController.updateCommands',
    'GET /:id': 'commandsController.getOne',
    'DELETE /:id': 'commandsController.deleteCommands'
};

module.exports = commandsRoutes;