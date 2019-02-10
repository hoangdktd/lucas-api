const categoryRoutes = {
    'POST /': 'categoryController.createCategory',
    'GET /': 'categoryController.getAll',
    'PUT /:id': 'categoryController.updateCategory',
    'GET /:id': 'categoryController.getOne',
    'DELETE /:id': 'categoryController.deleteCategory'
};

module.exports = categoryRoutes;