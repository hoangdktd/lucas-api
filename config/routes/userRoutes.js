const userRoutes = {
    'GET /': 'authController.getAll',
    'GET /:id': 'authController.getOne',
    'POST /': 'authController.register',
    'PUT /:id': 'userController.update',
    'DELETE /:id': 'userController.deleteUser',
    'PUT /change-password/:id': 'userController.changePassword',
};

module.exports = userRoutes;