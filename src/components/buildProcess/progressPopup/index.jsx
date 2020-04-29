import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { includes } from "lodash";

const ProgressPopup = props => {
  let { show, message, style, status, showProgressbar, gifSrc, width } = props;

  // percentage
  const percentageWidth = width;
  const marginLeft = percentageWidth - 3;
  let progressStyle = {
    ...style,
    width: width + "%"
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <Overlay className="overlay" />
      <BuildProcessContainer status={status} show={show}>
        <GifWrapper>
          <GifImg src={gifSrc} />
        </GifWrapper>
        <ProgressPercentageContainer>
          {showProgressbar ? (
            <ProgressPercentage style={{ marginLeft: `${marginLeft}%` }}>
              {percentageWidth}%
            </ProgressPercentage>
          ) : null}
        </ProgressPercentageContainer>
        <ProgressBarContainer status={status}>
          <ProgressBarTracker style={progressStyle} status={status} />
        </ProgressBarContainer>
        <Message status={status}>
          {message || "Creating your presentation."}
        </Message>
      </BuildProcessContainer>
    </>
  );
};

ProgressPopup.defaultProps = {
  width: 50,
  status: "InProgress",
  showProgressbar: true
};

const GifImg = styled.img`
  width: 24.5%;
  height: 268px;
  transform: translate(5%, -8%);
  @media (max-width: 1024px) {
    width: 37.5%;
    transform: translate(5%, -8%);
  }
`;

const GifWrapper = styled.div`
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
`;

const Message = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-weight: bold;
  color: ${props =>
    includes(["InProgress", "Completed"], props.status)
      ? `${props.theme.COLOR.MAIN}`
      : `${props.theme.COLOR.ERROR}`};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 3px;
`;

const BuildProcessContainer = styled.div`
  width: 100%;
  height: 455px;
  padding: ${props =>
    props.fileState === "InProgress" && props.show
      ? "50px 0 62px"
      : "50px 0 62px"};
  margin-top: 19px;
  border-radius: 4px;
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  position: relative;
  background-color: #fffdff;
  margin-bottom: 33px;
`;

const ProgressPercentageContainer = styled.div`
  position: relative;
  height: 40px;
  width: 730px;
  margin: 27px auto 0;
  @media (max-width: 948px) {
    width: ${props => (props.status === "InProgress" ? "730px" : "77%")};
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
    width: ${props => (props.status === "InProgress" ? "730px" : "77%")};
  }
  @media (max-width: 768px) {
    width: 568px;
  }
`;

const ProgressBarTracker = styled.div`
  height: 100%;
  border-radius: 4px;
  width: ${props => (props.status === "Failed" ? "100%" : "")} !important;
  transition: ${props =>
    props.status === "InProgress" ? "all 1s ease-in-out" : ""};
  background-color: ${props =>
    includes(["InProgress", "Completed"], props.status)
      ? `${props.theme.COLOR_PALLETE.APPLE_GREEN}`
      : includes(["Interrupted"], props.status)
      ? `${props.theme.COLOR_PALLETE.GOLDEN}`
      : `${props.theme.COLOR.ERROR}`};
  @media (max-width: 948px) {
    width: ${props => (props.status === "Failed" ? "100%" : "")} !important;
  }
  @media (max-width: 768px) {
    max-width: 568px !important;
  }
`;

export default ProgressPopup;
