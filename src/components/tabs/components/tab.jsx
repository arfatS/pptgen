import React, { Component } from "react";
import styled from "styled-components";
class Container extends Component {
  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label }
    } = this;

    return (
      <Tab
        className={`${
          activeTab === label
            ? "tab-list-item tab-list-active"
            : "tab-list-item"
        }`}
        active
        onClick={onClick}
      >
        {label}
      </Tab>
    );
  }
}

const Tab = styled.li`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 14px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  /* color: ${props => props.theme.COLOR.MAIN}; */
 
  &.tab-list-item {
    display: inline-block;
    list-style: none;
    margin-bottom: -1px;
    padding: 12px 0;
    cursor: pointer;
    width: 144px;
    height: 39px;
    text-align: center;
    background-color: ${props => props.theme.COLOR_PALLETE.ARMY_GREY};
    color: ${props => props.theme.COLOR.MAIN};
    opacity: .54;
    @media (max-width: 844px) {
      width: 75px;
    }
  }
  &.tab-list-active {
    background-color: white;
    border-width: 1px 1px 0 1px;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    box-shadow: none;
    background: #fff;
    opacity: 1;
    font-weight: bold;
    color: ${props => props.theme.COLOR.MAIN};
  }
  @media (max-width: 844px) {
    font-size: 12px;
  }
`;
export default Container;
