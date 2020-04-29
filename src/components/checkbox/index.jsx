import React from "react";
import styled from "styled-components";

const CheckBox = ({
  id,
  label,
  name,
  handleChange,
  checked,
  useButton,
  addPresentation,
  deck
}) => (
  <FormGroup className="checkbox-container">
    <Input
      type="checkbox"
      name={name}
      id={id}
      onChange={handleChange}
      checked={checked}
      className={useButton || deck ? "content-slide" : ""}
    />
    {useButton ? (
      <Button title={label} onClick={addPresentation}>
        {label}
      </Button>
    ) : (
      <Label deck={deck} htmlFor={id} title={deck ? label : ""}>
        {label}
      </Label>
    )}
  </FormGroup>
);

CheckBox.defaultProps = {
  id: "checkbox-element",
  label: "",
  name: "cb",
  handleChange: () => {}
};
const FormGroup = styled.div``;

const Label = styled.label`
  box-sizing: border-box;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-size: 12px;
  letter-spacing: -0.13px;
  margin-left: ${props => (props.deck ? "4%" : 0)};
  padding: ${props => (props.deck ? "1px 6px" : 0)};
  cursor: pointer;
`;

const Button = styled.button`
  width: 80%;
  border: none;
  margin-left: 4%;
  background-color: transparent;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-size: 12px;
  letter-spacing: -0.13px;
  cursor: pointer;
  outline: none;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Input = styled.input`
  vertical-align: middle;
  margin: 0;
  width: 16px;
  height: 16px;
  border-radius: 1px;
  border: solid 2px ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
  margin-right: 9px;
  position: relative;
  -webkit-appearance: none;
  appearance: none;
  background-color: ${props => props.theme.COLOR.WHITE};
  cursor: pointer;
  transition: all 0.3s;
  &::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid ${props => props.theme.COLOR.WHITE};
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
  }
  &:checked {
    background-color: ${props => props.theme.COLOR.USER_PRIMARY};
    border: solid 2px ${props => props.theme.COLOR.USER_PRIMARY};
  }
  &:focus {
    outline: none;
  }
  &.content-slide {
    margin-right: 0;
  }
`;
export default CheckBox;
