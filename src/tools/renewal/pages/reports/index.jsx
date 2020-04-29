import React from "react";
import Container from "./container";
import styled from "styled-components";
import DatePicker from "components/datePicker";
import RadioButton from "components/radioBtn";
import Button from "components/button";
import moment from "moment";
import BgWrapper from "components/bgWrapper";
import FullPageLoader from "components/FullPageLoader";

const Sales = ({ props, state, handleDateChange, getAdvanceData }) => {
  let { startDate, endDate } = state;

  const reportData = props.reportData || {};
  const reportLocation = props.reportLocation || {};
  const reportAdvanceLocation = props.reportAdvanceLocation || {};
  const startDateFormattedValue = moment(startDate).format("MMM D, YYYY");
  const endDateFormattedValue = moment(endDate).format("MMM D, YYYY");
  const currentDate = new Date();

  return (
    <>
      {(props.reportDataLoading || props.reportAdvanceLoading) && (
        <FullPageLoader layerIndex={2} />
      )}
      <PageWrapper>
        <Heading>Reporting</Heading>
        <AdvancedStats>
          <DateText>Created Between</DateText>
          <DatePickerContainer>
            <DatePicker
              placeholderText="From"
              handleChange={date => handleDateChange("startDate", date)}
              toolTip="From Date"
              value={startDate}
              currentMaxDate={currentDate}
            />
          </DatePickerContainer>
          <DatePickerContainer>
            <DatePicker
              placeholderText="To"
              handleChange={date => handleDateChange("endDate", date)}
              toolTip="To Date"
              value={endDate}
              currentMaxDate={currentDate}
            />
          </DatePickerContainer>
          <AdvancedStateHeading>Advanced Stats</AdvancedStateHeading>
          <RadioButtonContainer>
            <RadioButtonWrapper>
              <RadioButton
                handleChange={() => getAdvanceData({ allRenewals: true })}
                name="stats"
                label="All Renewals"
                id="user"
              />
            </RadioButtonWrapper>
            <RadioButtonWrapper>
              <RadioButton
                name="stats"
                label="Renewals by user"
                id="all"
                handleChange={() => getAdvanceData({ renewalsByuser: true })}
              />
            </RadioButtonWrapper>
            <RadioButtonWrapper>
              <RadioButton
                handleChange={() => getAdvanceData({ audit: true })}
                name="stats"
                defaultChecked={true}
                label="Audit trail"
                id="audit"
              />
            </RadioButtonWrapper>
          </RadioButtonContainer>
          <GenerateButton>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={reportAdvanceLocation.location}
              download
            >
              <Button width={"147px"} text="Generate" float="none" />
            </a>
          </GenerateButton>
        </AdvancedStats>
        <QuickStats>
          <QuickStatHeadingContainer>
            <QuickStatHeading>Quick Stats</QuickStatHeading>
            {/* <RefreshIconImage /> */}
          </QuickStatHeadingContainer>
          <DateRange>
            {startDateFormattedValue} - {endDateFormattedValue}
          </DateRange>
          <ResultsList>
            <List>
              <ListText>Total visits to landing page</ListText>
              <ListNumber>{reportData.totalLogins}</ListNumber>
            </List>
            <List>
              <ListText>Total logins</ListText>
              <ListNumber>{reportData.totalLogins}</ListNumber>
            </List>
            <List>
              <ListText>Total unique logins</ListText>
              <ListNumber>{reportData.uniqueLogins}</ListNumber>
            </List>
            <List>
              <ListText>Total renewals created</ListText>
              <ListNumber>{reportData.totalRenewalsCreated}</ListNumber>
            </List>
          </ResultsList>
          <DownloadButton
            href={reportLocation.location}
            target="_blank"
            download
          >
            Download
          </DownloadButton>
        </QuickStats>
      </PageWrapper>
    </>
  );
};

const PageWrapper = styled.div`
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 40px;
`;

const QuickStats = styled.div`
  width: 36.66%;
  display: inline-block;
  vertical-align: top;
  padding: 30px;
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  background-color: ${props => props.theme.COLOR.WHITE};
`;

const ResultsList = styled.ul`
  margin: 38px 0 47px;
`;

const List = styled.li`
  margin-bottom: 25px;
`;

const QuickStatHeadingContainer = styled.div``;

// const RefreshIconImage = styled(RefreshIcon)`
//   float: right;
//   cursor: pointer;
// `;

const GenerateButton = styled.div`
  a {
    display: inline-block;
  }

  button {
    height: 40px;
  }
`;

const DownloadButton = styled.a`
  display: inline-block;
  width: 99.3%;
  border-radius: 4px;
  text-align: center;
  padding: 9.5px 0 10.5px;
  border: 1px solid;
  border-color: ${props => props.theme.COLOR.MAIN};
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 14px;
  font-weight: bold;
  line-height: 18px;
  color: ${props => props.theme.COLOR.MAIN};
  cursor: pointer;
  transition: all 0.5s ease 0s;
  &:hover {
    color: ${props => props.theme.COLOR.WHITE};
    background: ${props => props.theme.COLOR.MAIN};
    border-color: ${props => props.theme.COLOR.MAIN};
  }
`;

const ListText = styled.span`
  display: inline-block;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.HEADING};
  margin-bottom: 4px;
  font-size: 12px;
`;

const ListNumber = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.HEADING};
  margin-bottom: 4px;
  font-size: 12px;
  float: right;
`;

const DatePickerContainer = styled.div`
  display: inline-block;
  width: 185px;
  margin-right: 10px;
  input {
    ${props => props.theme.SNIPPETS.FONT_STYLE}
    color: ${props => props.theme.COLOR.HEADING};
    font-weight: bold;
    margin-bottom: 4px;
    opacity: 0.7;
    letter-spacing: normal;
    font-size: 12px;
    padding-left: 7px;
  }
`;

const AdvancedStats = styled.div`
  width: calc(100% - 36.7%);
  display: inline-block;
`;

const Heading = styled.h2`
  margin: 37px 0 30px;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-weight: bold;
  font-size: 30px;
  color: ${props => props.theme.COLOR.MAIN};
`;

const AdvancedStateHeading = styled.h3`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.HEADING};
  font-weight: bold;
  margin-top: 61px;
  opacity: 0.7;
  letter-spacing: normal;
  font-size: 20px;
  margin-bottom: 20px;
`;

const QuickStatHeading = styled.h3`
  display: inline-block;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.HEADING};
  font-weight: bold;
  opacity: 0.7;
  letter-spacing: normal;
  font-size: 20px;
  margin-top: -4px;
`;

const RadioButtonContainer = styled.div`
  margin-bottom: 21px;
`;

const DateText = styled.span`
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.HEADING};
  font-weight: bold;
  margin-bottom: 4px;
  opacity: 0.7;
  letter-spacing: normal;
  font-size: 12px;
`;

const DateRange = styled.span`
  display: inline-block;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.HEADING};
  font-weight: bold;
  margin-top: 8px;
  opacity: 0.7;
  letter-spacing: normal;
  font-size: 12px;
`;

const RadioButtonWrapper = styled.div`
  margin-top: 11px;
  label {
    color: ${props => props.theme.COLOR.HEADING};
  }
`;

export default Container(BgWrapper(Sales));
