import _ from "lodash";
/**
 *
 */
const search = ({ data, searchFields, searchKeyWord }) => {
  if (
    data &&
    data.length > 0 &&
    searchFields &&
    searchFields.length > 0 &&
    searchKeyWord
  ) {
    let searchData = [];
    _.flatMap(searchFields, (field, index) => {
      _.flatMap(data, (item, itemIndex) => {
        if (
          item &&
          item[field] &&
          item[field]
            .toString()
            .toLowerCase()
            .indexOf(searchKeyWord.trim().toLowerCase()) > -1
        ) {
          let searchDataIndex = searchData.findIndex(
            searchElem => searchElem._id === item._id
          );
          if (searchDataIndex <= -1) {
            searchData.push(item);
          }
        }
      });
    });

    return searchData;
  }

  return [];
};

const tableSearch = (test, columns, searchValue, searchFields) => {
  return test.filter(row => {
    for (let j = 0; j < searchFields.length; j++) {
      for (let i = 0; i < columns.length; i++) {
        if (
          columns[i] === searchFields[j] &&
          row[columns[i]] &&
          (row[columns[i]]
            .toString()
            .toLowerCase()
            .indexOf(searchValue.trim().toLowerCase()) > -1 ||
            row[columns[i]]
              .toString()
              .toLowerCase()
              .indexOf(searchValue.trim().toUpperCase()) > -1)
        ) {
          return row;
        }
      }
    }
    return null;
  });
};
export { search, tableSearch };
