const customerRoutes = {
    'POST /': 'customerController.createCustomer',
    'GET /': 'customerController.getAll',
    'PUT /:id': 'customerController.updateCustomer',
    'GET /:id': 'customerController.getOne',
    'DELETE /:id': 'customerController.deleteCustomer'
};

module.exports = customerRoutes;