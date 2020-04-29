import React from "react";
import styled, { css } from "styled-components";
import Checkbox from "components/checkbox";

const Slides = ({
  title,
  _id,
  handleCheckBoxChange,
  parentObj,
  selectSlides,
  group,
  firstGroupElem,
  lastGroupElem,
  adjacentGroupElem,
  addPresentation,
  slideDetail
}) => {
  let className = `${group ? "group" : ""}  slides ${
    firstGroupElem ? "first" : ""
  } ${lastGroupElem ? "last" : ""} ${
    adjacentGroupElem ? "adjacent-group" : ""
  }`;

  return (
    <CheckboxWrapper className={className}>
      <Checkbox
        label={title}
        id={_id}
        checked={selectSlides.indexOf(_id) > -1 ? true : false}
        handleChange={e => {
          handleCheckBoxChange(
            e.target.checked,
            _id,
            (group && group.title) || "",
            parentObj,
            slideDetail
          );
        }}
        useButton={true}
        addPresentation={() => addPresentation(_id, parentObj, slideDetail)}
      />
    </CheckboxWrapper>
  );
};

const BorderCSS = css`
  content: "";
  width: 100%;
  height: 2px;
  display: block;
  position: absolute;
  background-color: ${props => props.theme.COLOR_PALLETE.COOL_BLUE};
  opacity: 0.3;
`;

const CheckboxWrapper = styled.div`
  vertical-align: top;
  .checkbox-container {
    padding: 5px 0 5px 12px;
  }

  &.group {
    background: #eef7f9;
  }

  &.first {
    padding-top: 4px;
    position: relative;

    &:not(:first-child) {
      margin-top: 2px;
    }

    &:after {
      ${props => props.theme.SNIPPETS.BOX_SHADOW_DARK};
      ${BorderCSS};
      top: 0;
    }
  }

  &.group:not(:first-of-type).adjacent-group {
    margin-top: 10px;
  }

  &.last {
    padding-bottom: 7px;
    position: relative;
    &:before {
      ${BorderCSS};
      bottom: 0;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.38);
    }
  }

  button {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

export default Slides;
