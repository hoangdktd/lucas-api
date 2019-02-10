const productRoutes = {
    'POST /': 'productController.createProduct',
    'GET /': 'productController.getAll',
    'PUT /:id': 'productController.updateProduct',
    'GET /:id': 'productController.getOne',
    'DELETE /:id': 'productController.deleteProduct'
};

module.exports = productRoutes;