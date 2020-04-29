import React, { Component } from "react";
import styled from "styled-components";

import LayoutSelector from "./components/layoutSelector";
import ModuleSelector from "./components/moduleSelector";
import StepDetails from "components/buildProcess/stepDetails";
import PreviewModal from "components/previewModal";
import Container from "./container";

class Modules extends Component {
  _renderLayouts = props => {
    if (!props.layoutData && !props.layoutData.length) {
      return null;
    }
    let layouts = props.layoutData.map((eachPage, index) => {
      return (
        <LayoutSelector
          key={index}
          index={index}
          pageData={eachPage}
          {...eachPage}
          {...props}
        />
      );
    });
    return layouts;
  };

  _rendersModules = props => {
    return <ModuleSelector {...props} />;
  };

  render() {
    let {
      moduleList,
      onModuleSelected,
      onLayoutSelected,
      layoutData,
      status,
      selectedLayoutType,
      onPlaceholderClick,
      selectedThumbnail,
      selectedPlaceholder,
      onOpenCloseModulePreview,
      modulePreviewUrl,
      modulePreviewData,
      handleContinue,
      isAppendixReq,
      deleteSelectedModule,
      isEdited,
      pdfSource
    } = this.props;

    let showBuildOptions = !isAppendixReq;
    let isBuildComplete = !!(pdfSource && status === "completed");
    return (
      <PageContainer>
        <StepDetails
          {...this.props}
          _build={showBuildOptions && !isBuildComplete}
          _download={showBuildOptions && isBuildComplete}
          _save={isEdited}
          _preview
          _continue
          onContinue={handleContinue}
          title="Topics"
          description="You may customize up to 3 content pages in your renewal. Start by
          choosing a layout option for each page below. Then select a placeholder and add a topic to it by selecting it from the left panel."
        />
        <ContentWrapper>
          {this._rendersModules({
            moduleList,
            selectedLayoutType: selectedLayoutType,
            onModuleSelected,
            selectedPlaceholder,
            onOpenCloseModulePreview
          })}
          {modulePreviewUrl ? (
            <PreviewModal
              closeModal={onOpenCloseModulePreview}
              width={modulePreviewData.layoutType === "stack" ? "70%" : "auto"}
              maxWidth={700}
            >
              <PreviewModalContentWrapper
                ref={a => {
                  if (!a) return;

                  let elem = a.querySelector(".preview-img");
                  if (elem && elem.clientWidth > elem.clientHeight) {
                    elem.style.width = "100%";
                    elem.style.height = "auto";
                  } else {
                    elem.style.width = "auto";
                    elem.style.height = "100%";
                  }
                }}
                selectedLayoutType={modulePreviewData.layoutType}
              >
                <Image
                  className="preview-img"
                  selectedLayoutType={modulePreviewData.layoutType}
                  src={modulePreviewUrl}
                  alt="Topic preview"
                />
              </PreviewModalContentWrapper>
            </PreviewModal>
          ) : null}
          {this._renderLayouts({
            layoutData: layoutData,
            onLayoutSelected,
            onPlaceholderClick,
            selectedThumbnail,
            selectedPlaceholder,
            deleteSelectedModule
          })}
        </ContentWrapper>
      </PageContainer>
    );
  }
}

const PageContainer = styled.div`
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  width: ${props => (props.selectedLayoutType === "single" ? "auto" : "100%")};
  max-width: 100%;
  height: 100%;
  max-height: 490px;
  display: block;
  margin: 0 auto;
`;

const PreviewModalContentWrapper = styled.div`
  height: ${props =>
    props.selectedLayoutType === "single" ? "calc(100vh - 200px)" : "auto"};
  max-height: 590px;
  padding: 50px 12px;

  @media (max-width: 768px) {
    height: ${props =>
      props.selectedLayoutType === "single" ? "calc(100vh - 415px)" : "auto"};
  }
`;
export default Container(Modules);
