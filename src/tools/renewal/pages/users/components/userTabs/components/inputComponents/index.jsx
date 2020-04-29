import React from "react";
import styled, { css } from "styled-components";
import { FaInfoCircle } from "react-icons/fa";

/**
 * Input Box
 */
export const InputBox = ({
  label,
  name,
  id,
  inputChangeHandler,
  type,
  value,
  disabled,
  hintData,
  maxLength
}) => {
  return (
    <FormGroup>
      <Label htmlFor={id}>{label}</Label>
      {hintData && (
        <IconWrapper>
          <StyledInfoIcon size={12} data-rh={hintData} data-rh-at="left" />
        </IconWrapper>
      )}
      <Input
        type={type}
        name={name}
        id={id}
        maxLength={maxLength}
        disabled={disabled}
        value={value}
        onChange={e =>
          inputChangeHandler(e, { propName: name, value: e.target.value })
        }
      />
    </FormGroup>
  );
};

const SharedLabelCss = css`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 10px;
  opacity: 0.64;
  display: inline-block;
  margin-bottom: 6px;
  color: ${props => props.theme.COLOR.MAIN};
  font-weight: bold;
  cursor: pointer;
`;

const Label = styled.label`
  ${SharedLabelCss}
`;

const IconWrapper = styled.span`
  width: 19px;
  height: auto;
  display: inline-block;
  padding: 5px;
  margin: -5px;
  cursor: pointer;
`;

const Input = styled.input`
  border: 1px solid rgba(151, 151, 151, 0.4);
  font-family: ${props => props.theme.FONT.LATO};
  transition: 1s border-bottom ease;
  font-size: 12px;
  color: ${props => props.theme.COLOR.HEADING};
  width: 100%;
  height: 30px;
  border-radius: 4px;
  padding: 0 5px;
`;

const StyledInfoIcon = styled(FaInfoCircle)`
  margin-top: 2px;
  size: 10px;
  transform: translate(5px, 1px);
  cursor: pointer;
  color: ${props => props.theme.COLOR.MAIN};
`;

const FormGroup = styled.div``;

InputBox.defaultProps = {
  label: "",
  name: "",
  id: "",
  inputChangeHandler: () => {}
};
