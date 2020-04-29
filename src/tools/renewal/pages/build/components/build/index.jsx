import React from "react";
import Container from "./container";
import styled from "styled-components";
import StepDetails from "components/buildProcess/stepDetails";
import ProgressBar from "./components/progressBar";
import { ErrorRound, ErrorTriangle } from "assets/icons";
import Group from "assets/icons/Group.png";
import hexToRgba from "utils/hexToRgba";
import GroupGif from "assets/icons/build-loader.gif";
import { includes } from "lodash";

const Build = props => {
  let {
    showBuildProgress,
    status,
    pdfSource,
    messages,
    modifyStep,
    progressBarWidth,
    onBuild,
    onDownload
  } = props;
  let isBuildComplete = !!(pdfSource && status === "completed");
  let description =
    includes(["inProgress"], status) && showBuildProgress
      ? "That’s it! We are building your renewal. Please do not navigate away from this page."
      : includes(["completed"], status) && pdfSource && isBuildComplete
      ? "Your renewal has been successfully created!"
      : !pdfSource
      ? `You may now create your renewal. Click "Build" to generate your renewal PDF.`
      : "";

  return (
    <>
      {/* place an overlay if build process is not completed */}
      {showBuildProgress && <Overlay className="overlay" />}
      <StepDetails
        title={"Build"}
        onBuild={onBuild}
        _build={!isBuildComplete}
        _edit={"Edit renewal"}
        _download={isBuildComplete}
        onDownload={(e, buttonRef) => {
          isBuildComplete && onDownload(e, buttonRef);
        }}
        onEdit={() => {
          modifyStep(0);
        }}
        description={description}
        {...props}
        modifyStep={props.modifyStep}
      />
      {showBuildProgress && (
        <BuildProcessContainer
          status={status}
          showBuildProgress={showBuildProgress}
        >
          {includes(["inProgress", "completed"], status) ? (
            <>
              {showBuildProgress ? (
                <GifWrapper>
                  <GifImg src={GroupGif} />
                </GifWrapper>
              ) : (
                <BuildImgContainer>
                  <GroupImage src={Group} />
                </BuildImgContainer>
              )}
            </>
          ) : (
            <>
              {status === "failed" ? <ErrorRoundIcon /> : <ErrorTriangleIcon />}
              <BuildImgContainer>
                <GroupImage src={Group} />
              </BuildImgContainer>
            </>
          )}
          <ProgressBar
            status={status}
            width={progressBarWidth}
            showBuildProgress={showBuildProgress}
          />
          {progressBarWidth === 100 && pdfSource && (
            <Message status={status}>
              {status === "completed"
                ? !showBuildProgress && messages[status]
                : messages[status]}
            </Message>
          )}
        </BuildProcessContainer>
      )}
    </>
  );
};

const GroupImage = styled.img`
  display: block;
  margin: 0 auto;
`;

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

const ErrorRoundIcon = styled(ErrorRound)`
  position: absolute;
  left: 48.5%;
  top: 48%;
  z-index: 2;
  transform: translate(-50%, -50%);
`;

const Message = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-weight: bold;
  color: ${props =>
    includes(["inProgress", "completed"], props.status)
      ? `${props.theme.COLOR.MAIN}`
      : `${props.theme.COLOR.ERROR}`};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 3px;
`;

const BuildImgContainer = styled.div`
  position: relative;
`;

const ErrorTriangleIcon = styled(ErrorTriangle)`
  position: absolute;
  left: 48.5%;
  top: 48%;
  z-index: 2;
  transform: translate(-50%, -50%);
`;

const BuildProcessContainer = styled.div`
  width: 100%;
  height: 455px;
  padding: ${props =>
    props.fileState === "inProgress" && props.showBuildProgress
      ? "50px 0 62px"
      : "50px 0 62px"};
  margin-top: 19px;
  border-radius: 4px;
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  position: relative;
  background-color: #fffdff;
  margin-bottom: 33px;
`;

export default Container(Build);
