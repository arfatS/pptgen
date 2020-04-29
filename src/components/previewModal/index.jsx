import React, { Component } from "react";
import styled from "styled-components";

import { Close } from "assets/icons";
import handleBodyScroll from "utils/handleBodyScroll";
import hexToRgba from "utils/hexToRgba";

class PreviewModal extends Component {
  componentDidMount() {
    handleBodyScroll({ action: "open" });
  }

  componentWillUnmount() {
    handleBodyScroll({ action: "close" });
  }

  render() {
    const { closeModal, width, maxWidth, disableCloseAction } = this.props;

    return (
      <>
        <PreviewModalOverlay onClick={closeModal} />
        <Modal width={width} maxWidth={maxWidth}>
          {this.props.children}
          {!disableCloseAction && (
            <CloseIconWrapper>
              <CloseIcon onClick={closeModal} />
            </CloseIconWrapper>
          )}
        </Modal>
      </>
    );
  }
}

PreviewModal.defaultProps = {
  closeModal: () => {},
  width: "70%",
  maxWidth: "873"
};

const PreviewModalOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
  z-index: 1000;
`;

const Modal = styled.div`
  width: ${props => props.width};
  max-width: ${props => props.maxWidth}px;
  height: auto;
  text-align: center;
  position: fixed;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.COLOR.WHITE};
  z-index: 1001;
  @media (max-width: 968px) {
    max-width: 518px;
  }
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: -14px;
  right: -13px;
  background-color: ${props => props.theme.COLOR.WHITE};
  width: 34px;
  border-radius: 50%;
  height: 34px;
  cursor: pointer;
`;

const CloseIcon = styled(Close)`
  transform: translate(-50%, -50%);
  margin-left: 50%;
  margin-top: 50%;
  width: 26px;
  height: 26px;
`;

export default PreviewModal;
