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
          id={props.id}
          name={props.name}
          onChange={e => {
            props.handleChange({ id: props.id, event: e });
          }}
          checked={props.checked ? true : undefined}
        />
        <span className="checkmark" />
      </Label>
    </FormGroup>
  );
};

RadioButton.defaultProps = {
  checked: false,
  id: "page-1",
  name: "defaultName"
};

const FormGroup = styled.div`
  display: block;
  user-select: none;
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 10px;
    width: 10px;
    background-color: ${props => props.theme.COLOR.CONTAINER};
    border-radius: 50%;
    border: 2px solid ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    &:after {
      content: "";
      position: absolute;
      display: none;
    }
    &:after {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      margin: 50%;
      background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
      border-radius: 50%;
      opacity: 1;
    }
  }
  label {
    padding-left: 35px;
    display: inline;
    cursor: pointer;
  }
`;

const InputBox = styled.input`
  color: ${props => props.theme.COLOR.MAIN};
  margin-right: 10px;
  position: absolute;
  opacity: 0;
  &:checked ~ .checkmark {
    border: 2px solid #636363;
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
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  color: ${props => props.theme.COLOR.GREY};
  position: relative;
  display: inline-block;
`;

export default RadioButton;
