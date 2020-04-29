import React from "react";
import { ChromePicker } from "react-color";
import styled from "styled-components";

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: "#fefefe"
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({ color: color.hex });
  };

  render() {
    const cover = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px"
    };

    let { title } = this.props;
    return (
      <Float>
        <FloatLeft>
          <SubHeading>{title}</SubHeading>
        </FloatLeft>
        <FloatRight>
          <Button onClick={this.handleClick} color={this.state.color} />
          {this.state.displayColorPicker ? (
            <Popover>
              <div style={cover} onClick={this.handleClose} />
              <ChromePicker
                onChange={this.handleChange}
                color={this.state.color}
              />
            </Popover>
          ) : null}
        </FloatRight>
      </Float>
    );
  }
}

const SubHeading = styled.span`
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
`;

const Button = styled.button`
  width: 98px;
  height: 30px;
  background-color: ${props => props.color};
  border: solid 1px #979797;
  border-radius: 4px;

  &:focus {
    outline: none;
  }
`;

const Float = styled.div`
  width: 100%;

  &:after {
    content: "";
    clear: both;
    display: table;
  }
`;

const Popover = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 30px;
  right: -10px;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-top: 12px solid #fff;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    position: absolute;
    bottom: -12px;
    right: 20px;
  }
`;

const FloatRight = styled.div`
  float: right;
`;
const FloatLeft = styled.div`
  padding: 6px 0 7px;
  float: left;
`;

export default ColorPicker;
