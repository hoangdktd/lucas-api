 
module.exports = {
    statusEnum: ['ACTIVATED', 'DEACTIVATED', 'DELETED', 'WAITING_APPROVE', 'NONE'],
    orderStatusEnum: ['new', 'pending', 'done', 'cancelled'],
    paymentStatusEnum: ['TT', 'CTT'],
    typeDesignerEnum:  ['online', 'offline'],
    serverError: 'Internal server error',
    serverSuccess: 'success',
    serverErrorCode: 500,
    serverSuccessCode: 200,
    token: 'X-Access-Token',
    masterKey: "phamduylaideptrai",
    userTypeList : ['admin', 'saler', 'deliver', 'designer'],
    userRoleAdmin: 0,
    userRoleSaler: 1,
    userRoleDeliver: 2,
    userRoleDesigner: 3,
    userRoleUser: 4,
    limitGetData: 'perPage',
    offsetGetData: 'page',
    keywordSearchText: 'q',
    searchFieldInUserColumn: ['userId', 'displayName'],
    filterFieldInUserColumn: ['userType', 'userRole'],
    searchFieldInCustomerColumn: ['displayName', 'email', 'address'],
    filterFieldInCustomerColumn: ['displayName', 'email', 'address'],
    searchFieldInCategoryColumn: ['name'],
    filterFieldInCategoryColumn: ['name'],
    searchFieldInProductColumn: ['name'],
    filterFieldInProductColumn: ['name'],
    searchFieldInCommandsColumn: ['name'],
    filterFieldInCommandsColumn: ['name'],
    searchFieldInChannelColumn: ['name'],
    filterFieldInChannelColumn: ['name'],
    searchFieldInOrderColumn: ['idPackage'],
    filterFieldInOrderColumn: ['idPackage', 'designerId', 'customerId', 'infoOrderLink', 'channel', 'saleId'],
    sortFieldInOrderColumn: ['priceOrder', 'createDate', 'updatedAt'],
    orderStatus: ['ordered', 'delivered', 'cancelled']
};