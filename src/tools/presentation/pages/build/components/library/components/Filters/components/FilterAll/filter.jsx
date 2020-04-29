import React from "react";
import styled from "styled-components";
import { map } from "lodash";

import { Dropdown } from "assets/icons";
import Checkbox from "components/checkbox";
import ShadowScrollbars from "components/custom-scrollbars/ShadowScrollbars";

const CheckBoxComponent = ({
  title,
  _key,
  index,
  _id,
  checked,
  handleCheckBoxChange
}) => {
  return (
    <CheckBoxWrapper>
      <Checkbox
        handleChange={e => {
          let flag = e.target.checked;
          handleCheckBoxChange(_id, flag);
        }}
        label={title}
        id={`${_key}${index}`}
        checked={checked}
      />
    </CheckBoxWrapper>
  );
};

const Filter = ({
  _id,
  childrens,
  title,
  seletedFilters,
  handleStateChange,
  onChangeHandleFiltersCheck,
  selectedTabValue
}) => {
  const ActiveScrollbarProps = {
    autoHeight: true,
    autoHeightMax: 134,
    renderTrackHorizontal: () => <HorizontalScrollbar />
  };

  let childrensList = [];
  if (Array.isArray(childrens)) {
    childrensList = childrens.map(({ _id }) => _id);
  }

  // set filters children to check if exists
  seletedFilters = Array.isArray(seletedFilters) ? seletedFilters : [];

  const handleCheckBoxChange = (_id, checked) => {
    const selectedIndex = seletedFilters.indexOf(_id);

    if (_id.indexOf("F-") > -1 && checked && selectedIndex < 0) {
      // check if children list already pushed in filters to avoid duplicates
      childrensList.forEach(elem => {
        let index = seletedFilters.indexOf(elem);
        index === -1 && seletedFilters.push(elem);
      });
    } else if (_id.indexOf("F-") > -1 && !checked && selectedIndex > -1) {
      // remove parent from selectedFilters
      seletedFilters.splice(selectedIndex, 1);
      // remove childrens from selectedFilters
      childrensList.forEach(elem => {
        let index = seletedFilters.indexOf(elem);
        index > -1 && seletedFilters.splice(index, 1);
      });
    } else if (selectedIndex < 0 && checked) {
      // select and handle child checked status
      seletedFilters.push(_id);

      //handle all flag status if childs are selected individuallly
      if (Array.isArray(childrens)) {
        let allFlagStatus = childrens.filter(
          ({ _id }) => seletedFilters.indexOf(_id) > -1
        );

        let allTagElement = childrens.filter(
          ({ _id }) => _id.indexOf("F-") > -1
        );

        if (allFlagStatus.length === childrens.length - 1) {
          seletedFilters.push(allTagElement[0]._id);
        }
      }
    } else if (selectedIndex > -1 && !checked) {
      // remove parent selected filter if child is unchecked
      let parentIndex = seletedFilters.indexOf(
        childrensList.filter(elem => elem.indexOf("F-") > -1)[0]
      );
      parentIndex > -1 && seletedFilters.splice(parentIndex, 1);

      // remove selected filter if unchecked
      const selectedIndex = seletedFilters.indexOf(_id);
      selectedIndex > -1 && seletedFilters.splice(selectedIndex, 1);
    }

    handleStateChange({
      key: "seletedFilters",
      value: seletedFilters,
      // handle filters checkbox with search
      cb: onChangeHandleFiltersCheck(selectedTabValue === "View by Topic")
    });
  };

  return (
    <FilterTypeWrapper key={_id + "" + Math.random()}>
      <FilterTypeHeader>
        <FilterTypeHeading>{title}</FilterTypeHeading>
        <Dropdown />
      </FilterTypeHeader>
      <FilterTypeValues>
        <ShadowScrollbars className="scrollContainer" {...ActiveScrollbarProps}>
          {map(childrens, ({ _id, title }, index) => {
            let key = _id + Math.random();
            return (
              <CheckBoxComponent
                key={key}
                _key={key}
                title={title}
                index={index}
                _id={_id}
                checked={seletedFilters.indexOf(_id) > -1}
                handleCheckBoxChange={handleCheckBoxChange}
              />
            );
          })}
        </ShadowScrollbars>
      </FilterTypeValues>
    </FilterTypeWrapper>
  );
};

export default Filter;

const FilterTypeHeader = styled.div`
  margin-bottom: 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterTypeValues = styled.div`
  .scrollContainer {
    & > div {
      &:first-of-type {
        /* Important is added so as to override plugin styling */
        margin-right: 0 !important;
        margin-bottom: 0 !important;
        overflow: auto !important;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          width: 0 !important;
        }
      }
    }
  }

  .shadowBottom {
    width: 100%;
    height: 35px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      ${props => props.theme.COLOR.SCROLL_SHADOW},
      ${props => props.theme.COLOR.WHITE}
    );
    pointer-events: none;
  }
`;

const FilterTypeWrapper = styled.div`
  margin-bottom: 17px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FilterTypeHeading = styled.h4``;

const CheckBoxWrapper = styled.div`
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }

  /* If last child is > 5th child */
  &:nth-of-type(n + 5):last-of-type {
    margin-bottom: 0;
    padding-bottom: 18px;
  }

  .checkbox-container {
    label {
      font-size: 14px;
      color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
      text-transform: capitalize;
    }
  }
`;

const HorizontalScrollbar = styled.div`
  display: none;
`;
