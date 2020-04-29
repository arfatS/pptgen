import React from "react";
import styled from "styled-components";

import hexToRgba from "utils/hexToRgba";

const TabToggleHeaderContainer = ({ active, manageStates, data, width, padding }) => {
  const propName = "activeTab";
  let $Tabs =
    data.length &&
    data.map((ele, index) => (
      <Tab
        onClick={() => manageStates({ propName, value: ele.value })}
        className={active === `${ele.value}` ? "active-tab" : ""}
        key={index}
        width={width}
        padding={padding}
      >
        <TabButton className={active === `${ele.value}` ? "active" : ""}>
          <Text className={active === `${ele.value}` ? "active" : ""}>
            {ele.title}
          </Text>
        </TabButton>
      </Tab>
    ));
  return <TabToggleHeader>{$Tabs}</TabToggleHeader>;
};

TabToggleHeaderContainer.defaultProps = {
  width: "50%"
};
/**
 * Tab Container and buttons styles
 */
const TabToggleHeader = styled.ul`
  background-color: #f4f7fc;
`;

const Tab = styled.li`
  width: ${props => (props.width ? props.width : "auto")};
  display: inline-block;
  vertical-align: top;
  text-align: center;
  padding: ${props => (props.padding ? props.padding : "15px 21px 8px")};
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  background: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
  box-shadow: inset 6px 0px 15px 0 rgba(0, 0, 0, 0.14);
  &.active-tab {
    box-shadow: none;
    background: ${props => props.theme.COLOR.WHITE};
  }
  box-sizing: border-box;
  cursor: pointer;

  @media screen and (max-width: 1023px) {
    padding: 15px 10px 8px;
  }
`;

const Text = styled.span`
  padding-bottom: 4px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.4)};
  font-family: ${props => props.theme.FONT.REG};
  user-select: none;
  &.active {
    font-weight: bold;
    color: ${props => props.theme.COLOR.MAIN};
    position: relative;
    border-bottom: 3px solid ${hexToRgba("#215eff", 0.63)};
  }
`;

const TabButton = styled.div`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  cursor: pointer;
`;

export default TabToggleHeaderContainer;
