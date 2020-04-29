import React from "react";
import styled from "styled-components";

const InputField = ({ type, id, placeholder, name, value, label }) => {
  return (
    <FormGroup>
      <Label htmlFor={id}>{label}</Label>
      <InputBox
        className="form-control"
        type={type}
        id={id}
        name={name}
        value={value}
      />
    </FormGroup>
  );
};

InputField.defaultProps = {
  type: "text",
  placeholder: "Placeholder",
  name: "Name",
  label: ""
};

const InputBox = styled.input`
  ${props => props.theme.SNIPPETS.SHARED_INPUT_STYLE}
  padding: 7px 8px;
`;

const FormGroup = styled.div`
  margin-top: 6px;
  max-width: auto;
  border-radius: 4px;
  position: relative;
`;

const Label = styled.label`
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 12px;
  font-weight: bold;
`;

export default InputField;
