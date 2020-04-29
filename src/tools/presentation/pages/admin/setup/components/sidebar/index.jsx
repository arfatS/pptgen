import React, { Component } from "react";
import styled, { css } from "styled-components";
import hexToRgba from "utils/hexToRgba";

class Sidebar extends Component {
  state = {
    selectedValue: ""
  };

  componentDidMount() {
    this.setState({
      selectedValue: this.props.selectedTab
    });
  }

  static defaultProps = {
    tabList: [
      {
        title: "TabName",
        value: "TabValue",
        defaultSelected: false
      }
    ]
  };

  _onClick = ({ title, value }) => e => {
    let { onTabSelected } = this.props;

    this.setState(
      {
        selectedValue: value
      },
      () => {
        if (onTabSelected) onTabSelected({ title, value });
      }
    );
  };

  _renderList = () => {
    let { tabList } = this.props;
    let { selectedValue } = this.state;
    let Tabs = tabList.map((tabItem, index) => (
      <List
        isSelected={selectedValue === tabItem.value}
        key={`${index}-${tabItem.value}`}
        onClick={this._onClick(tabItem)}
      >
        {tabItem.title}
      </List>
    ));

    return Tabs;
  };

  render() {
    return <Container>{this._renderList()}</Container>;
  }
}

export default Sidebar;

const Container = styled.ul`
  max-width: 250px;
  height: 500px;
  width: 26.48%;
  display: inline-block;
  padding: 23px 0;
  border-radius: 4px;
  background-color: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;
`;

const List = styled.li`
  width: 100%;
  padding: 4px 0 5px 28px;
  margin-bottom: 7px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 18px;
  font-weight: normal;
  color: ${props =>
    props.isSelected
      ? props.theme.COLOR_PALLETE.BROWNISH_GREY
      : hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.74)};
  border-left: 2px transparent solid;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background-color: ${props =>
      hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
    border-left: 2px ${props => props.theme.COLOR.USER_PRIMARY} solid;
  }

  ${props =>
    props.isSelected &&
    css`
      background-color: ${props =>
        hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
      border-left: 2px ${props => props.theme.COLOR.USER_PRIMARY} solid;
    `}
`;
