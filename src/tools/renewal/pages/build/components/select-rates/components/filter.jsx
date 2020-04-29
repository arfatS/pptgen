import React from "react";
import styled from "styled-components";
import SearchBox from "components/searchBox";
import DropDown from "components/dropDown";
import DatePicker from "components/datePicker";

// filter rate component for underwriter
const FiltersComponent = props => {
  const {
    rateListQueryParams: { startDate, endDate },
    stateDropDownList,
    handleStateChange
  } = props;

  // dropdown list for state
  let optionList = (Array.isArray(stateDropDownList) && stateDropDownList) || [
    "All"
  ];

  return (
    <>
      <FiltersContainer className="clearfix">
        <SearchContainer>
          <SearchBox
            bgColor="#fff"
            padding="13px 0"
            border="1px solid rgba(151, 151, 151, 0.3)"
            float="none"
            handleChange={props.handleRateListSearch}
            marginRight="15px"
            eventOnKeyUp={true}
          />
        </SearchContainer>
        <SelectState>
          <DropDownContainer>
            <DropDown
              handleChange={handleStateChange}
              title={"State"}
              height={"44px"}
              option={optionList}
            />
          </DropDownContainer>
          <DatePickerContainer>
            <DatePicker
              title={"Created Between"}
              toolTip="From Date"
              handleChange={date =>
                props.handleSelectedDateEvents({
                  prop: "startDate",
                  value: date
                })
              }
              placeholderText={"From"}
              value={startDate}
            />
          </DatePickerContainer>
          <DatePickerContainer>
            <DatePicker
              title={" To "}
              toolTip="To Date"
              placeholderText={"To"}
              value={endDate}
              handleChange={date =>
                props.handleSelectedDateEvents({
                  prop: "endDate",
                  value: date
                })
              }
            />
          </DatePickerContainer>
        </SelectState>
      </FiltersContainer>
    </>
  );
};

const FiltersContainer = styled.div`
  min-width: 550px;
  background: #f4f7fc;
  margin-bottom: 20px;
  @media (min-width: 1025px) {
    min-width: 850px;
  }
  @media (max-width: 920px) {
    width: 95%;
    position: absolute;
    z-index: 15;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 20px;
  }
`;

const DropDownContainer = styled.div`
  width: 125px;
  display: inline-block;
  vertical-align: top;
  margin-right: 45px;
  div {
    background: ${props => props.theme.COLOR.BACKGROUND_COLOR};
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 125px;
  }
  @media (max-width: 1024px) {
    margin-right: 30px;
  }
`;

const DatePickerContainer = styled.div`
  width: 125px;
  display: inline-block;
  vertical-align: top;
  &:nth-of-type(2) {
    margin-right: 20px;
  }
  &:nth-of-type(3) {
    label:first-child {
      visibility: hidden;
    }
  }
  @media (min-width: 767px) and (max-width: 1024px) {
    width: 130px;
  }
`;

const SearchContainer = styled.div`
  margin-top: 32px;
  display: inline-block;
  vertical-align: top;
  margin-right: 45px;
  min-width: calc(43% - 2px);
  @media (max-width: 1030px) {
    min-width: 200px;
  }
  div {
    width: 100%;
    min-width: 200px;
    margin-right: 0;
  }
  input {
    width: 88.5%;
    min-width: 162px;
    height: 44px;
  }
  @media (max-width: 1024px) {
    margin-top: 33px;
    width: 200px;
    min-width: 200px;
    margin-right: 30px;
    div {
      width: 200px;
    }
    input {
      width: 77%;
      min-width: auto;
    }
  }
`;

const SelectState = styled.div`
  float: right;
  label {
    padding-top: 13px;
  }
`;

export default FiltersComponent;
