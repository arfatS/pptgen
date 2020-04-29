import React from "react";
import styled from "styled-components";
import Button from "components/button";
import { FilterAll } from "./components/FilterAll";
import hexToRgba from "utils/hexToRgba";

/**
 * Component defined for aside filter
 * @param {*} props
 */
export const Filters = ({
  filters,
  seletedFilters,
  handleStateChange,
  onChangeHandleFiltersCheck,
  selectedTabValue
}) => {
  const props = {
    filters,
    seletedFilters,
    handleStateChange,
    onChangeHandleFiltersCheck,
    selectedTabValue
  };

  return (
    <>
      <FilterHead>
        <FiltersTitle>filters</FiltersTitle>
        <Button
          buttonClass="clear"
          onClick={() => onChangeHandleFiltersCheck(true, true)}
          text="Clear All"
          width="74px"
        />
      </FilterHead>
      <FilterTypesContainer>
        <FilterAll {...props} />
      </FilterTypesContainer>
    </>
  );
};

const FilterHead = styled.div`
  margin-bottom: 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .clear {
    width: auto;
    height: auto;
    padding: 5px 14px;
    border: solid 1px ${props => props.theme.COLOR_PALLETE.GREY};
    background-color: ${props => props.theme.COLOR.WHITE};
    color: ${props => props.theme.COLOR_PALLETE.GREY};
    font-size: 12px;
    font-weight: normal;

    &:hover {
      color: ${props => props.theme.COLOR.WHITE};
      background-color: ${props => props.theme.COLOR_PALLETE.GREY};
    }
  }
`;

const FiltersTitle = styled.h3`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.7)};
  font-weight: bold;
  text-transform: capitalize;
`;

const FilterTypesContainer = styled.div`
  h4 {
    color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.7)};
    font-weight: bold;
    font-size: 14px;
  }
`;
