import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FromDate, ToDate } from "assets/icons";

const DatePickerComponent = ({
  handleChange,
  value,
  title,
  height,
  placeholderText,
  toolTip,
  className,
  currentMaxDate,
  minDate
}) => {
  return (
    <FormGroup className={className || ""}>
      {title ? <Label>{title}</Label> : null}
      <DatePicker
        id={title}
        customInput={<InputBox readOnly height={height} />}
        onChange={date => {
          handleChange(date);
        }}
        selected={value ? value : new Date()}
        placeholderText={placeholderText}
        dateFormat="MMM d, yyyy"
        ref={ref => {
          if (ref) {
            ref.input.readOnly = true;
          }
        }}
        maxDate={currentMaxDate ? currentMaxDate : null}
        title={toolTip}
        minDate={minDate ? minDate : null}
      />
      <DatePickerLabel htmlFor={title}>
        {toolTip === "From Date" ? (
          <FromDateIcon title={title} size={20} />
        ) : (
          <ToDateIcon title={title} size={20} />
        )}
      </DatePickerLabel>
    </FormGroup>
  );
};

DatePickerComponent.defaultProps = {
  value: null,
  title: "",
  defaultValue: null,
  handleChange: () => {},
  height: "44px",
  placeholderText: "Date"
};

const FormGroup = styled.div`
  max-width: ${props => (props.width ? `${props.width}px` : "100%")};
  width: 100%;
  border-radius: 4px;
  position: relative;

  .react-datepicker-popper {
    z-index: 2;
    right: 0;
    left: unset !important;
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }

  .react-datepicker__triangle {
    left: 73%;
  }
`;

const DatePickerLabel = styled.label`
  pointer-events: none;
`;

const FromDateIcon = styled(FromDate)`
  position: absolute;
  right: 7px;
  top: ${props => (props.title ? "70%" : "50%")};
  transform: translateY(-50%);
  cursor: pointer;
`;

const ToDateIcon = styled(ToDate)`
  position: absolute;
  right: 7px;
  top: ${props => (props.title ? "70%" : "50%")};
  transform: translateY(-50%);
  cursor: pointer;
`;

const Label = styled.label`
  padding-bottom: 3px;
  display: inline-block;
  font-size: "12px";
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 1)};
`;

const InputBox = styled.input`
  width: 100%;
  height: ${props => props.height};
  font-size: 14px;
  font-family: ${props => props.theme.FONT.REG};
  background: ${props => props.theme.COLOR.BACKGROUND_COLOR};
  border-radius: 4px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  outline: none;
  border: none;
  box-sizing: border-box;
  text-indent: 10px;

  @media (min-width: 767px) and (max-width: 1024px) {
    text-indent: 8px;
  }
  user-select: none;
`;

export default DatePickerComponent;
