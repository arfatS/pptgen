import React, { Fragment } from "react";
import styled, { css } from "styled-components";

//comoponents
import Checkbox from "components/checkbox";
import hexToRgba from "utils/hexToRgba";
import DatePicker from "components/datePicker";
import MultiSelect from "./components/MultiSelect";

const SetupDetails = props => {
  let { setupDetails, onChangeInput, handleCheckbox } = props;

  return (
    <DetailsContainer>
      {setupDetails &&
        setupDetails.map(
          (
            {
              label,
              value,
              error,
              type,
              editable,
              options,
              key,
              isMulti,
              handleChange,
              defaultValue,
              minDate
            },
            index
          ) => {
            // label group item for setup fields
            const labelGroupItem = (
              <Fragment key={index}>
                {type === "text" && (
                  <LabelGroup key={index}>
                    {label && <Label>{label}</Label>}
                    {type === "text" && editable && (
                      <LabelInput
                        type={type}
                        value={value}
                        onChange={e =>
                          onChangeInput({
                            value: e.target.value,
                            label,
                            key: key
                          })
                        }
                        onBlur={e => {
                          onChangeInput({
                            value: e.target.value,
                            label,
                            key: key
                          });
                        }}
                        ref={ref => {
                          if (label === "Presentation Name*") props.setRef(ref);
                        }}
                      />
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </LabelGroup>
                )}
                {type === "date" && (
                  <DatePickerContainer>
                    <DatePicker
                      className={"presentationDate"}
                      title={label}
                      toolTip={label}
                      value={value}
                      handleChange={date => {
                        onChangeInput({
                          label,
                          key: key,
                          date: date,
                          flag: true
                        });
                      }}
                      placeholderText={"From"}
                      minDate={minDate}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </DatePickerContainer>
                )}
                {type === "multi-select" &&
                  Array.isArray(options) &&
                  options.map(({ _id, label, options }) => (
                    <LabelGroup key={_id}>
                      {label && <Label>{label}</Label>}
                      <MultiSelect
                        placeholder={"Select an option"}
                        options={options}
                        value={
                          (typeof defaultValue[_id] === "object" &&
                            defaultValue[_id]) ||
                          null
                        }
                        onChange={selected => handleChange(selected, _id)}
                        closeMenuOnSelect={false}
                        isClearable
                        isMulti
                      />
                      {error && <ErrorMessage>{error}</ErrorMessage>}
                    </LabelGroup>
                  ))}
                {type === "select" && (
                  <LabelGroup>
                    {label && <Label>{"Content Repo*"}</Label>}
                    <SelectContainer
                      key={index}
                      top={index === 3}
                      bottom={index === 5}
                      className={isMulti ? "multi-select" : ""}
                    >
                      <MultiSelect
                        placeholder={label}
                        onChange={handleChange}
                        options={options}
                        value={defaultValue}
                      />
                      {error && <ErrorMessage>{error}</ErrorMessage>}
                    </SelectContainer>
                  </LabelGroup>
                )}
                {type === "checkbox" && label && (
                  <Checkbox
                    key={key}
                    handleChange={e => {
                      handleCheckbox(e, e.target.checked, label, type);
                    }}
                    checked={value}
                    label={label}
                    id={label}
                  />
                )}
              </Fragment>
            );

            return labelGroupItem;
          }
        )}
    </DetailsContainer>
  );
};

const DetailsContainer = styled.div`
  flex-basis: 35.5%;
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  background-color: #ffffff;
  padding: 24px 41px;
  .dropdown-container {
    margin: 20px 0;
    label {
      padding-top: 8px;
    }
  }
  .checkbox-container {
    margin: 20px 0;
    label {
      margin-left: 4px;
      letter-spacing: -0.2px;
    }
  }
`;

const SelectContainer = styled.div`
  padding-bottom: 0px;
  ${props =>
    props.top
      ? "padding-top: 15px"
      : props.bottom
      ? "margin-bottom: 29px;"
      : ""};
  label {
    top: -2px;
  }

  &.multi-select {
    overflow: hidden;
    select {
      width: 108%;
      height: auto;
      padding: 10px;
      margin: -5px -20px -5px -5px;
    }

    option::selection {
      background: red;
    }
  }
`;

const sharedInputStyle = css`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 3px;
  padding: 7px 8px;
  height: 30px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  background: ${props => props.theme.COLOR.INPUT};
  outline: none;
`;

const LabelGroup = styled.div`
  margin-bottom: 10px;
`;

const LabelCSS = css`
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.64)};
  margin-bottom: 4px;
  display: inline-block;
`;

const Label = styled.span`
  ${LabelCSS}
`;

const LabelInput = styled.input`
  ${sharedInputStyle};
  &:focus {
    border: 2px solid ${props => props.theme.COLOR.INPUT_FOCUS};
  }
`;

const ErrorMessage = styled.span`
  font-size: 10px;
  font-family: ${props => props.theme.FONT.REG};
  color: ${props => props.theme.COLOR_PALLETE.ERROR};
  text-align: left;
`;

const DatePickerContainer = styled.div`
  margin-bottom: 7px;
  vertical-align: top;
  &:nth-of-type(2) {
    margin-right: 20px;
  }
  &:nth-of-type(3) {
    label:first-child {
      visibility: hidden;
    }
  }
  .presentationDate {
    label {
      ${LabelCSS}
      margin-bottom: 0;
    }
    input {
      height: 30px;
      ${sharedInputStyle}
    }
    svg {
      top: 66%;
    }
  }
`;

export default SetupDetails;
