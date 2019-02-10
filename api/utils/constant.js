
module.exports = {
    statusEnum: ['ACTIVATED', 'DEACTIVATED', 'DELETED', 'WAITING_APPROVE', 'NONE'],
    serverError: 'Internal server error',
    serverSuccess: 'success',
    serverErrorCode: 500,
    serverSuccessCode: 200,
    token: 'X-Access-Token',
    masterKey: "phamduylaideptrai",
    userTypeList : ['admin', 'saler', 'deliver', 'designer'],
    limitGetData: 'perPage',
    offsetGetData: 'page',
    keywordSearchText: 'q',
    searchFieldInUserColumn: ['userId', 'displayName'],
    filterFieldInUserColumn: ['userType', 'userRole'],
    searchFieldInCustomerColumn: ['displayName', 'email', 'address'],
    filterFieldInCustomerColumn: ['displayName', 'email', 'address'],
    searchFieldInCategoryColumn: ['name'],
    filterFieldInCategoryColumn: ['name'],
    orderStatus: ['ordered', 'delivered', 'cancelled']
};