import React from "react";
import { map } from "lodash";
import FilterList from "./filter";

/**
 * Helper function to fetch filter type values
 * @param {Filter types and Filter data array} filterParams
 */
export const FilterAll = props => {
  const { filters } = props;

  return map(filters, ({ childrens, ...elem }, index) => {
    // check children length and add options as all at top
    let childrensExists = Array.isArray(childrens) && childrens.length;
    if (childrensExists) {
      childrens = [...childrens];
      childrens.unshift({ _id: `F-${index}`, title: "All" });
    }

    return (
      <FilterList key={index} {...props} {...elem} childrens={childrens} />
    );
  });
};
