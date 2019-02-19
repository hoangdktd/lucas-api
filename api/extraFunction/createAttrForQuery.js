const oConstant = require('../utils/constant');
const filterAndSearch = (query, filterList, searchList) =>{
    attr = {};
    attr.where = {};
    searchText = [];
    if (query[oConstant.limitGetData] && query[oConstant.offsetGetData]) {
      attr.limit = query[oConstant.limitGetData];
      attr.offset = (query[oConstant.offsetGetData] - 1) * query[oConstant.limitGetData];
    };
    if (query[oConstant.keywordSearchText]) {
      for (var i = 0; i < searchList.length; i++){
        var obj = {};
        obj[searchList[i]] = { like: "%" + query[oConstant.keywordSearchText].toString() + "%" };
        searchText.push(obj);
      }
      attr.where.$or = searchText;
    };

    for (var i = 0; i< filterList.length; i++){
      if (query[filterList[i]]) {
        attr.where[filterList[i]] = query[filterList[i]];
      }
    };
    if (query['startDate'] && query['endDate']){
      console.log(query['startDate'])
      attr.where.createDate = {$between: [query['startDate'], query['endDate']]}
      console.log(attr.where)
    }
    attr.where.isDelete = false
    return attr
}

module.exports = {
    filterAndSearch
}