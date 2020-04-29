import React, { Component } from "react";
import styled from "styled-components";
import PreviewModal from "../previewModal";

class PdfPopup extends Component {
  render() {
    let { url } = this.props;
    return (
      <PreviewModal {...this.props}>
        <ScrollableFrame src={`${url}#page=1&nameddest=HelloWorld`} />
      </PreviewModal>
    );
  }
}

PdfPopup.defaultProps = {
  url:
    "https://www.w3docs.com/uploads/media/default/0001/01/540cb75550adf33f281f29132dddd14fded85bfc.pdf"
};

const ScrollableFrame = styled.iframe`
  padding: 10px;
  width: 100%;
  height: calc(100vh - 300px);
  min-height: 400px;
  box-sizing: border-box;
`;

export default PdfPopup;
