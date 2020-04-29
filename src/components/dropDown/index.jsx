import React from "react";
import styled from "styled-components";
import _ from "lodash";
import hexToRgba from "utils/hexToRgba";
import { Dropdown as DropdownIcon } from "assets/icons";
/**
 * Parent Slide Container Box
 */
const SlideDropDown = ({
  parentSlide,
  handleChange,
  elemId,
  option,
  height,
  title,
  placeholder,
  defaultValue,
  ...props
}) => (
  <>
    {title ? <Label>{title}</Label> : null}
    <ParentSlideComponent parentSlide={parentSlide}>
      <AngleDown htmlFor={elemId} className="angle-down">
        <DropdownIcon />
      </AngleDown>
      <DropDown
        {...props}
        onChange={event => {
          let index = event.nativeEvent.target.selectedIndex;
          handleChange(event, option[index - 1] || {});
        }}
        defaultValue={defaultValue}
        height={height}
        autoFocus={true}
        id={`${elemId}`}
      >
        {placeholder && <DropDownOption>{placeholder}</DropDownOption>}
        {_.map(option, (item, key) => {
          let itemKey = item instanceof Object ? _.get(item, "_id") : item;
          let itemValue = item instanceof Object ? _.get(item, "title") : item;
          return (
            <DropDownOption value={itemKey} key={itemKey + key}>
              {itemValue}
            </DropDownOption>
          );
        })}
      </DropDown>
    </ParentSlideComponent>
  </>
);
SlideDropDown.defaultProps = {
  parentSlide: false,
  elemId: "parent",
  option: ["Select Parent"],
  height: "30px",
  title: null,
  handleChange: () => {}
};
const Label = styled.label`
  padding-bottom: 3px;
  display: inline-block;
  font-size: "12px";
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 1)};
`;
const AngleDown = styled.label`
  position: absolute;
  padding-top: 5px;
  right: 0;
  width: 23px;
  top: 0;
  z-index: -1;
  height: ${props => props.height};
  background: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
`;
const ParentSlideComponent = styled.div`
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: 4px;
  background: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: "";
  }
`;
const DropDown = styled.select`
  width: 100%;
  height: ${props => props.height};
  padding: 0 9px;
  border: none;
  border-radius: 4px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
  font-family: ${props => props.theme.FONT.REG};
  background: transparent;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  line-height: 30px;
  cursor: pointer;
  outline: none;
`;
const DropDownOption = styled.option``;
export default SlideDropDown;
