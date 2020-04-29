import React from "react";
import styled from "styled-components";
const RadioButton = props => {
  return (
    <FormGroup className="form-group">
      <Label htmlFor={props.id}>
        {props.label}
        <InputBox
          className="form-control"
          type="radio"
          id={props.id && props.id}
          name={props.name && props.name}
          onChange={props.handleChange}
          defaultChecked={props.defaultChecked}
        />
        <span className="checkmark" />
      </Label>
    </FormGroup>
  );
};

RadioButton.defaultProps = {
  defaultChecked: false
};

const FormGroup = styled.div`
  display: inline-block;
  width: 50%;
  position: relative;
  user-select: none;
  #all ~ .checkmark {
    margin-left: 37px;
  }
  .checkmark {
    position: absolute;
    top: -3px;
    left: 0px;
    height: 20px;
    width: 20px;
    margin-left: 17px;
    background-color: ${props => props.theme.COLOR.CONTAINER};
    border-radius: 50%;
    border: 2px solid ${props => props.theme.COLOR.MAIN};
    opacity: 0.64;
    &:after {
      content: "";
      position: absolute;
      display: none;
    }
    &:after {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      margin: 50%;
      background: ${props => props.theme.COLOR.MAIN};
      border-radius: 50%;
      opacity: 1;
    }
  }
  label {
    cursor: pointer;
    width: 100%;
  }
`;

const InputBox = styled.input`
  width: 20px;
  height: 20px;
  color: ${props => props.theme.COLOR.MAIN};
  margin-right: 10px;
  position: absolute;
  opacity: 0;
  &:checked ~ .checkmark {
    border: 2px solid ${props => props.theme.COLOR.MAIN};
    border-radius: 50%;
    opacity: 1;
  }
  &:checked ~ .checkmark:after {
    display: block;
    opacity: 1;
  }
`;

const Label = styled.label`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  width: 71px;
  height: 15px;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.MAIN};
  position: relative;
  top: -5px;
  width: 65%;
  display: inline-block;
`;

export default RadioButton;
