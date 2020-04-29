import React from "react";
import styled from "styled-components";

import Container from "./container";
import RenewalStepper from "components/buildProcess/stepper";
import SelectRates from "./components/select-rates";
import Modules from "./components/modules";
import Appendix from "./components/appendix";
import Build from "./components/build";
import ProgressPopup from "components/progressPopup";
import PdfPopup from "components/pdfPopup";
import ConfirmPopup from "components/confirmPopup";
import { Prompt } from "react-router";

// switch component based on step value
const SwitchComponentByStep = props => {
  const { activeStep, progressData } = props;
  // switch activeStep based on value
  switch (activeStep) {
    case 0:
      return <SelectRates {...props} />;
    case 1:
      return (
        <Modules {...props} status={progressData && progressData.status} />
      );
    case 2:
      return (
        <Appendix {...props} status={progressData && progressData.status} />
      );
    case 3:
      return (
        <Build
          {...props}
          progressBarWidth={progressData && progressData.percentage}
          status={progressData && progressData.status}
        />
      );
    default:
      return null;
  }
};

// renewal child container
const RenewalContainer = props => (
  <RenewalComponentContainer {...props}>
    {props.children}
  </RenewalComponentContainer>
);

const RenewalComponent = props => {
  const {
    activeStep,
    isBuilding,
    closePreview,
    showPreview,
    previewSource,
    isSaving,
    showWarning,
    onPopupClose,
    onConfirm,
    appendixPopupText,
    isEdited,
    isAppendixDelete
  } = props;

  return (
    <>
      {isEdited && (
        <Prompt
          when={isEdited}
          message="You haven't saved your progress. Hitting refresh or back will lose your work."
        />
      )}
      <RenewalStepper {...props} />
      <RenewalContainer>
        <SwitchComponentByStep activeStep={activeStep} {...props} />
      </RenewalContainer>
      {isBuilding ? (
        <ProgressPopup isPopupOpen={isBuilding} />
      ) : isSaving || isAppendixDelete ? (
        <ProgressPopup
          isPopupOpen={isSaving || isAppendixDelete}
          text="Saving..."
        />
      ) : null}
      {showPreview && (
        <PdfPopup closeModal={closePreview} url={previewSource} />
      )}
      {showWarning && (
        <ConfirmPopup
          onPopupClose={onPopupClose}
          onPositiveHandler={onConfirm}
          onNegativeHandler={onPopupClose}
          warningText={appendixPopupText}
          positiveText="Yes"
          negativeText="No"
        />
      )}
    </>
  );
};

const RenewalComponentContainer = styled.div`
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  width: ${props => props.theme.WRAPPER.WIDTH};
  margin: 0 auto;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  @media (max-width: 1024px) {
    width: calc(100% - 80px);
  }
`;

export default Container(RenewalComponent);
