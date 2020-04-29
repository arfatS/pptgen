import React from "react";
import { Dropdown as DropdownIcon } from "assets/icons";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import _ from "lodash";
/**
 * Parent Slide Container Box
 */
const SlideDropDown = ({
  parentSlide,
  option,
  height,
  isDropDownOpen,
  handleSelectClick,
  handleOptionClick,
  selectedDropDown
}) => {
  return (
    <ParentSlideComponent parentSlide={parentSlide}>
      <DropdownHeader
        onClick={e => handleSelectClick({ e })}
        height={height}
        counter={option.length}
      >
        <span>{selectedDropDown && selectedDropDown.name}</span>
        {option.length > 1 && (
          <AngleDown>
            <DropdownIcon />
          </AngleDown>
        )}
      </DropdownHeader>
      {option.length > 1 && (
        <DropdownList isDropDownOpen={isDropDownOpen}>
          {_.map(option, (item, key) => {
            return (
              <DropDownOption
                onClick={e =>
                  handleOptionClick({ selectedTool: item, event: e })
                }
                key={item + key}
              >
                {item.name}
              </DropDownOption>
            );
          })}
        </DropdownList>
      )}
    </ParentSlideComponent>
  );
};

export default SlideDropDown;

SlideDropDown.defaultProps = {
  parentSlide: false,
  elemId: "parent",
  option: [{ name: "Select Parent", value: "Select Parent" }],
  height: 30
};

const AngleDown = styled.label`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: -1;
  background: ${props => hexToRgba(props.theme.COLOR.USER_PRIMARY, 1)};
  svg {
    path {
      fill: ${props => props.theme.COLOR.WHITE};
    }
  }
  cursor: pointer;
`;

const ParentSlideComponent = styled.div`
  position: relative;
  z-index: 10;
`;

const DropdownHeader = styled.div`
  width: 100%;
  height: ${props => (props.height ? `${props.height}px` : `30px`)};
  position: relative;
  z-index: 10;
  padding: 0 14px;
  background: ${props => hexToRgba(props.theme.COLOR.USER_PRIMARY, 1)};
  border: none;
  border-radius: 4px;
  color: ${props => props.theme.COLOR.WHITE};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  line-height: 30px;
  cursor: ${props => (props.counter > 1 ? `cursor` : `default`)};
  outline: none;
  appearance: none;
  display: flex;
  align-items: center;
  padding: ${props => (props.counter > 1 ? `0 14px` : `0 27px`)};
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 101%;
  width: 100%;
  display: ${props => (props.isDropDownOpen ? "block" : "none")};
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW}
  border-radius: 3px;
`;

const DropDownOption = styled.li`
  padding: 11px 10px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  cursor: pointer;

  &:hover {
    background-color: ${props =>
      hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.09)};
  }
`;
