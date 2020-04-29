import React from "react";
import hexToRgba from "utils/hexToRgba";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FaInfoCircle } from "react-icons/fa";
import { Calendar } from "assets/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputField = props => {
  let {
    type,
    id,
    handleChange,
    handleFocus,
    placeholder,
    name,
    error,
    defaultValue,
    value,
    width,
    isFixedTitle,
    hint
  } = props;
  let $isError = !!error;

  return (
    <FormGroup width={width}>
      {type === "textarea" ? (
        <InputArea
          className="form-control"
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={e => {
            handleChange &&
              handleChange({
                value: e.target.value,
                id
              });
          }}
          onFocus={handleFocus && handleFocus(name)}
          isError={$isError}
          autoComplete="anyrandomstring"
        />
      ) : type === "date" ? (
        <DatePicker
          customInput={<InputBox readOnly />}
          onChange={date => {
            handleChange && handleChange({ date: date, id });
          }}
          selected={value || defaultValue}
          ref={ref => {
            if (ref) {
              ref.input.readOnly = true;
            }
          }}
        />
      ) : (
        <InputBox
          className="form-control"
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={e => {
            handleChange &&
              handleChange({
                value: e.target.value,
                id
              });
          }}
          onFocus={handleFocus && handleFocus(name)}
          isError={$isError}
          autoComplete="anyrandomstring"
          required
        />
      )}
      <Label isFixedTitle={isFixedTitle}>
        {placeholder}{" "}
        {hint && <StyledInfoIcon size={10} data-rh={hint} data-rh-at="right" />}
      </Label>

      {$isError && <Error>{error}</Error>}

      {type === "date" && <StyledDate size={20} />}
    </FormGroup>
  );
};

InputField.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  width: PropTypes.number,
  handleChange: PropTypes.func,
  handleFocus: PropTypes.func,
  isFixedTitle: PropTypes.bool,
  hint: PropTypes.string
};

InputField.defaultProps = {
  type: "text",
  isDisabled: false,
  placeholder: "Placeholder",
  name: "Name",
  error: "",
  isFixedTitle: true,
  hint: ""
};

const InputBox = styled.input`
  width: 100%;
  height: 30px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: ${props => props.theme.FONT.REG};
  margin-top: 16px;
  background-color: ${props => hexToRgba(props.theme.COLOR.WHITE, "0.18")};
  border: 1px solid
    ${props =>
      props.isError
        ? props.theme.COLOR_PALLETE.RED
        : hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, "0.4")};
  border-radius: 4px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  box-sizing: border-box;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
  &:focus {
    outline: none;
    box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.13);
  }
`;

const StyledInfoIcon = styled(FaInfoCircle)`
  margin-top: 2px;
  size: 10px;
  transform: translateY(1px);
  cursor: pointer;
`;

const StyledDate = styled(Calendar)`
  position: absolute;
  right: 7px;
  top: 66%;
  transform: translateY(-50%);
`;

const InputArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: ${props => props.theme.FONT.REG};
  margin-top: 16px;
  background-color: ${props => hexToRgba(props.theme.COLOR.WHITE, "0.18")};
  border: 1px solid
    ${props =>
      props.isError
        ? props.theme.COLOR_PALLETE.RED
        : hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, "0.4")};
  border-radius: 4px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  box-sizing: border-box;
  resize: none;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.13);
  }
`;

const FormGroup = styled.div`
  margin-top: 6px;
  max-width: ${props => (props.width ? `${props.width}px` : "auto")};
  width: 100%;
  border-radius: 4px;
  position: relative;

  .react-datepicker-popper {
    z-index: 2;
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }
`;

const Error = styled.span`
  position: absolute;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.ERROR, "1")};
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 10px;
  font-weight: normal;
  top: 0;
  right: 0;
  pointer-events: none;
`;

const Label = styled.label`
  position: absolute;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, "0.64")};
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 14px;
  font-weight: normal;
  top: 22px;
  left: 10px;
  transition: 0.3s ease all;

  ${props =>
    props.isFixedTitle
      ? `
      top: 0px;
      left: 0px;  
      font-size: 10px;
      font-weight: bold;
    `
      : `${InputBox}:focus ~ &,
    ${InputBox}:not(:focus):valid ~ & {
      transform: translateY(-22px);
      font-size: 10px;
      font-weight: bold;
      left: 0;
    }}`}
`;

export default InputField;
