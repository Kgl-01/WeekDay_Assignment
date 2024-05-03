import _, { filter } from "lodash"

export const applyFilter = (array, query) => {
  return _.isEmpty(query) || !_.isNull(query)
    ? array.filter(
        (element) =>
          element?.minExp == query ||
          element?.companyName == query ||
          element?.location == query ||
          element?.location == query ||
          element?.role == query ||
          element?.minJdSalary == query
      )
    : array
}
