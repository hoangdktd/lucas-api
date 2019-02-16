const orderRoutes = {
    'POST /': 'orderController.createOrder',
    'GET /': 'orderController.getAll',
    'PUT /:id': 'orderController.updateOrder',
    'GET /:id': 'orderController.getOne',
    'DELETE /:id': 'orderController.deleteOrder'
};

module.exports = orderRoutes;