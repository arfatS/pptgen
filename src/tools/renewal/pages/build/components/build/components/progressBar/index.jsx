import React from "react";
import styled from "styled-components";
import Container from "./container";
import { includes } from "lodash";

const ProgressBar = props => {
  let { style, status } = props;

  // show email sent message when the progress bar reaches 100%
  const percentageWidth = props.width;

  let marginLeft = percentageWidth - 3;
  style = {
    width: props.width + "%"
  };

  return (
    <>
      <ProgressPercentageContainer>
        {includes(["inProgress", "completed"], status) ? (
          <ProgressPercentage style={{ marginLeft: `${marginLeft}%` }}>
            {percentageWidth}%
          </ProgressPercentage>
        ) : null}
      </ProgressPercentageContainer>
      <ProgressBarContainer status={status}>
        <ProgressBarTracker style={style} status={status} />
      </ProgressBarContainer>
    </>
  );
};

const ProgressPercentageContainer = styled.div`
  position: relative;
  height: 40px;
  width: 730px;
  margin: 27px auto 0;
  @media (max-width: 948px) {
    width: ${props => (props.status === "inProgress" ? "730px" : "77%")};
  }
`;

const ProgressPercentage = styled.span`
  margin-top: 20px;
  transition: all 1s ease-in-out;
  display: inline-block;
  position: absolute;
  left: 0;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-weight: bold;
  color: ${props => props.theme.COLOR.MAIN};
`;

const ProgressBarContainer = styled.div`
  width: 730px;
  height: 10px;
  border-radius: 4px;
  margin: 0 auto;
  background-color: ${props => props.theme.COLOR.LIGHT_GREY};
  @media (max-width: 948px) {
    width: ${props => (props.status === "inProgress" ? "730px" : "77%")};
  }
  @media (max-width: 768px) {
    width: 568px;
  }
`;

const ProgressBarTracker = styled.div`
  height: 100%;
  border-radius: 4px;
  width: ${props => (props.status === "failure" ? "100%" : "")} !important;
  transition: ${props =>
    props.status === "inProgress" ? "all 1s ease-in-out" : ""};
  background-color: ${props =>
    includes(["inProgress", "completed"], props.status)
      ? `${props.theme.COLOR_PALLETE.APPLE_GREEN}`
      : includes(["interrupt"], props.status)
      ? `${props.theme.COLOR_PALLETE.GOLDEN}`
      : `${props.theme.COLOR.ERROR}`};
  @media (max-width: 948px) {
    width: ${props => (props.status === "failure" ? "100%" : "")} !important;
  }
  @media (max-width: 768px) {
    max-width: 568px !important;
  }
`;

export default Container(ProgressBar);
