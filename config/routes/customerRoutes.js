const customerRoutes = {
    'POST /': 'customerController.createCustomer',
    'GET /': 'customerController.getAll',
    'GET /:customerId': 'customerController.getOne',
    'DELETE /:customerId': 'customerController.deleteCustomer'
};

module.exports = customerRoutes;