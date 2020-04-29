import React from "react";
import styled from "styled-components";
import Container from "./container";

//components
import Stepper from "components/buildProcess/stepper";
import Setup from "./components/setup";
import Theme from "./components/theme";
import Library from "./components/library";
import Build from "./components/build";
import Sort from "./components/sort";
import Loader from "components/loader";
import FullPageLoader from "components/FullPageLoader";
import SlidePreview from "./components/slidePreview";

// switch component based on step value
const SwitchComponentByStep = props => {
  const { activeStep } = props;

  // switch activeStep based on value
  switch (activeStep) {
    case 0:
      return <Setup {...props} />;
    case 1:
      return <Theme {...props} />;
    case 2:
      return <Library {...props} />;
    case 3:
      return <Sort {...props} />;
    case 4:
      return <Build {...props} />;
    default:
      return null;
  }
};

const PresentationComponent = props => {
  const {
    activeStep,
    userProfileMeta,
    isLoading,
    isThemeListLoading,
    isCoverListLoading,
    isImageCategoryListLoading,
    isFiltersLoading,
    isTopicSearchLoading,
    isLogoListUploading,
    isSlideDetailLoading,
    isSaveDataLoading,
    showModal,
    closeModal,
    hideModal,
    addRemoveSlideFromPreview,
    nextStepHandler,
    isGetPresentationLoading
  } = props;
  // show loader if api is in progress
  if (
    (userProfileMeta && !Object.keys(userProfileMeta).length) ||
    isLoading ||
    isImageCategoryListLoading ||
    isFiltersLoading ||
    isGetPresentationLoading
  ) {
    return <Loader />;
  }

  let isFullPageLoaderActive =
    isThemeListLoading ||
    isCoverListLoading ||
    isTopicSearchLoading ||
    isLogoListUploading ||
    isSlideDetailLoading ||
    isSaveDataLoading;

  return (
    <>
      {isFullPageLoaderActive ? <FullPageLoader /> : ""}
      <Stepper {...props} modifyStep={nextStepHandler} />
      <PresentationContainer>
        <SwitchComponentByStep activeStep={activeStep} {...props} />
      </PresentationContainer>
      {showModal ? (
        <SlidePreview
          closeModal={closeModal}
          hideModal={hideModal}
          addRemovePresentation={addRemoveSlideFromPreview}
          {...props}
        />
      ) : null}
    </>
  );
};

const PresentationContainer = styled.div`
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  width: ${props => props.theme.WRAPPER.WIDTH};
  margin: 0 auto;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  @media (max-width: 1024px) {
    width: calc(100% - 80px);
  }
  .content {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
  }
`;

export default Container(PresentationComponent);
