import React from "react";
import styled from "styled-components";

import hexToRgba from "utils/hexToRgba";

const TabToggleHeaderContainer = ({ active, manageStates }) => {
  const propName = "activeTab";

  return (
    <TabToggleHeader>
      <Tab
        onClick={() => {
          manageStates({ propName, value: "slide" });
        }}
        className={active === "slide" ? "active-tab" : ""}
      >
        <TabButton className={active === "slide" ? "active" : ""}>
          Slides
        </TabButton>
      </Tab>
      <Tab
        onClick={() => {
          manageStates({ propName, value: "group" });
        }}
        className={active === "group" ? "active-tab" : ""}
      >
        <TabButton className={active === "group" ? "active" : ""}>
          Groups
        </TabButton>
      </Tab>
    </TabToggleHeader>
  );
};

/**
 * Tab Container and buttons styles
 */
const TabToggleHeader = styled.ul`
  transform: translateY(-4px);
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  overflow: hidden;
`;

const Tab = styled.li`
  width: 50%;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  padding: 12px 21px 0;
  background: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
  box-shadow: inset 6px 0px 15px 0 rgba(0, 0, 0, 0.14);
  &.active-tab {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    box-shadow: none;
    background: ${props => props.theme.COLOR.WHITE};
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -2px;
      height: 3px;
      width: calc(100% - 42px);
      border-radius: 5px;
      background: ${props => hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.63)};
      transform: translateX(-50%);
    }
  }
  cursor: pointer;
`;

const TabButton = styled.button`
  width: 100%;
  padding-bottom: 9px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  outline: none;
  cursor: pointer;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.4)};
  font-family: ${props => props.theme.FONT.REG};
  &.active {
    padding-bottom: 7px;
    font-weight: bold;
    color: ${props => props.theme.COLOR.MAIN};
    /* border-bottom: 2px solid ${hexToRgba("#215eff", 0.63)}; */
  }
`;

/**
 * //END
 * Tab Container and buttons styles
 */

export default TabToggleHeaderContainer;
