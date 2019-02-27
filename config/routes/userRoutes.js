const userRoutes = {
    // 'GET /': 'authController.getAll',
    'POST /': 'userController.createUser',
    'GET /': 'userController.getAll',
    'GET /:id': 'userController.getOne',
    'PUT /:id': 'userController.update',
    'DELETE /:id': 'userController.deleteUser',
    'PUT /change-password/:id': 'userController.changePassword',
    'DELETE /': 'userController.deleteManyUser'
};

module.exports = userRoutes;