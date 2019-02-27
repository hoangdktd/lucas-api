const customerRoutes = {
    'POST /': 'customerController.createCustomer',
    'GET /': 'customerController.getAll',
    'PUT /:id': 'customerController.updateCustomer',
    'GET /:id': 'customerController.getOne',
    'DELETE /:id': 'customerController.deleteCustomer',
    'DELETE /': 'customerController.deleteManyCustomer'
};

module.exports = customerRoutes;