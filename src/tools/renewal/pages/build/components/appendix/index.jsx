import React from "react";
import styled from "styled-components";
import Container from "./container";
import AppendixList from "./components/appendixList";
import ChooseFile from "./components/chooseFile";
import StepDetails from "components/buildProcess/stepDetails";
import ToastUtils from "utils/handleToast";
import PdfPopup from "components/pdfPopup";

const SearchPriorities = props => {
  props.validFileStatus &&
    ToastUtils.handleToast({
      operation: "error",
      message: props.validFileStatus
    });
  if (props.validFileStatus) {
    props.emptyFileStatus();
  }
  let {
    pdfSource,
    status,
    appendixSource,
    showAppendixPreview,
    closeAppendixPreview
  } = props;
  let isBuildComplete = !!(pdfSource && status === "completed");
  return (
    <AppendixWrapper>
      <StepDetails
        _build={!isBuildComplete}
        _preview
        _download={isBuildComplete}
        title={"Appendix"}
        description={"Create, Edit and Delete Appendix Items"}
        {...props}
      />
      {props.isAppendixReq && (
        <Warning>
          This proposal may require state mandated reporting. Please add the
          necessary documents to the appendix section.
        </Warning>
      )}
      <PanelContainer className="clearfix">
        <AppendixList {...props} />
        <ChooseFile {...props} />
      </PanelContainer>
      {showAppendixPreview && appendixSource && (
        <PdfPopup closeModal={closeAppendixPreview} url={appendixSource} />
      )}
    </AppendixWrapper>
  );
};

const PanelContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 100px;
`;

const Warning = styled.span`
  margin-top: 20px;
  width: 54%;
  display: inline-block;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 12px;
  color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
`;
const AppendixWrapper = styled.div``;

export default Container(SearchPriorities);
