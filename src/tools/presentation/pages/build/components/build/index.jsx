//Lib
import React from "react";
import styled from "styled-components";

//Components
import Container from "./container";
import StepDetails from "components/buildProcess/stepDetails";
import { BuildOption } from "./components/BuildOption";
import PresentationShare from "components/presentationShareForm";
import ProgressPopup from "components/buildProcess/progressPopup";
import { PPTLoader } from "assets/images";
import { get } from "lodash";

const UI_STRINGS = {
  BUILD_COMPLETE: "Your presentation has been successfully created!",
  BUILD_INCOMPLETE: "Choose the format below and click Build to export.",
  BUILD_INPROGRESS: "Building your presentation"
};

const Build = props => {
  let {
    buildProgress,
    handleDownload,
    getAvailableBuild,
    buildValue,
    onEdit,
    presentationData,
    getDefaultSelected,
    isBuilding
  } = props;

  // Presentation Build Options
  let option = props.options.map(build => {
    return (
      <BuildOption
        labelValue={build.label}
        idValue={build.id}
        selected={buildValue === build.id}
        key={build.id}
        changedValue={props.changeHandler}
      />
    );
  });

  // Check if build is complete
  let availableBuild = getAvailableBuild();
  let type = getDefaultSelected();
  // Show download cta on all option if type of available build is zip
  let buildAvailable = !!(buildValue === type || type === "zip");
  // Check available builds
  let isBuildComplete =
    availableBuild && availableBuild.length && buildAvailable;

  let isBuildProgress = isBuilding && !isBuildComplete;
  let { pptLocation, pdfLocation } = presentationData || {};
  let sharePPTactive = !!get(pptLocation, "url") || !!get(pdfLocation, "url");

  return (
    <BuildWrapper>
      <StepDetails
        title="Build"
        description={
          isBuildComplete
            ? UI_STRINGS.BUILD_COMPLETE
            : isBuildProgress
            ? UI_STRINGS.BUILD_INPROGRESS
            : UI_STRINGS.BUILD_INCOMPLETE
        }
        _share={!!isBuildComplete && sharePPTactive}
        _edit="Edit"
        onEdit={onEdit}
        _download={!!isBuildComplete}
        onDownload={handleDownload}
        _build={!!!isBuildComplete}
        onShare={props.overlayHandler}
        onBuild={props.buildHandler}
      />
      <MainContainer>
        {!!!isBuildProgress && option}

        {props.showShare && (
          <PresentationShare
            submitText="Send"
            showcheckbox={true}
            checkboxLabel="Send copy to myself"
            shareDescription="Send a copy to another user via email"
            {...props}
            selectedPresentation={presentationData}
          />
        )}
      </MainContainer>
      <ProgressPopup
        show={isBuildProgress}
        gifSrc={PPTLoader}
        width={get(buildProgress, "percentage")}
        status={get(buildProgress, "status")}
        message={UI_STRINGS.BUILD_INPROGRESS}
      />
    </BuildWrapper>
  );
};

const BuildWrapper = styled.div``;

const MainContainer = styled.div`
  margin-top: 40px;

  .form-group {
    margin-bottom: 10px;
    color: ${props => props.theme.COLOR.HEADING};

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-overlay {
    top: calc(50% + 53px);
  }
`;

export default Container(Build);
