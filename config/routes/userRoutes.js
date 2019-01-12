const userRoutes = {
    // 'GET /': 'authController.getAll',
    'POST /': 'userController.createUser',
    'GET /': 'userController.getAll',
    'GET /:userId': 'userController.getOne',
    'PUT /:userId': 'userController.update',
    'DELETE /:userId': 'userController.deleteUser',
    'PUT /change-password/:userId': 'userController.changePassword',
};

module.exports = userRoutes;