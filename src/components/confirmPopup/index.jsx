import React from "react";
import { Close } from "assets/icons";
import styled, { css } from "styled-components";

const Overlay = props => {
  let okButtonRef;
  return (
    <ConfirmBoxWrapper>
      <ConfirmBoxOverlay onClick={props.onPopupClose} />
      <ConfirmBox>
        <QuestionText>{props.warningText}</QuestionText>
        <CloseIconWrapper>
          <CloseIcon onClick={props.onPopupClose} />
        </CloseIconWrapper>
        <ButtonWrapper>
          {props.positiveText && (
            <OkButton
              ref={ref => (okButtonRef = ref)}
              onClick={e => props.onPositiveHandler(e, okButtonRef)}
            >
              {props.positiveText}
            </OkButton>
          )}
          {props.negativeText && (
            <CancelButton onClick={props.onNegativeHandler}>
              {props.negativeText}
            </CancelButton>
          )}
        </ButtonWrapper>
      </ConfirmBox>
    </ConfirmBoxWrapper>
  );
};

Overlay.defaultProps = {
  onPopupClose: () => {},
  onNegativeHandle: () => {},
  onPositiveHandler: () => {},
  positiveText: "Ok",
  warningText: "Do you want to continue ?"
};

const SharedDeleteCss = css`
  width: 20%;
  opacity: 0.8;
  border-radius: 3px;
  border: solid 1px ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
  display: inline-block;
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: bold;
  line-height: 1.42;
  color: ${props => props.theme.COLOR.HEADING};
  padding: 25px 10px 23px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.COLOR_PALLETE.DARK_GREY};
    transition: all 0.7s;
    color: ${props => props.theme.COLOR.WHITE};
    opacity: 1;
  }
`;

const ConfirmBoxWrapper = styled.div``;
const OkButton = styled.button`
  ${SharedDeleteCss}
  margin-top: 46px;
  margin-bottom: 43px;
  padding: 10px;
  background-color: ${props => props.theme.COLOR.WHITE};
  @media (max-width: 968px) {
    margin-top: 45px;
  }
`;

const ConfirmBox = styled.div`
  box-sizing: border-box;
  width: 70%;
  max-width: 769px;
  padding: 0 20px;
  text-align: center;
  position: fixed;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.COLOR.WHITE};
  z-index: 20;
  @media (max-width: 968px) {
    width: 518px;
  }
`;

const QuestionText = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 22px;
  font-weight: bold;
  padding-top: 42px;
  color: ${props => props.theme.COLOR.HEADING};
  opacity: 0.7;
  @media (max-width: 968px) {
    font-size: 25px;
  }
`;

const ButtonWrapper = styled.div`
  width: 67%;
  margin: 0 auto;
`;

const CloseIcon = styled(Close)`
  transform: translate(-50%, -50%);
  margin-left: 50%;
  margin-top: 50%;
  width: 26px;
  height: 26px;
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

const CancelButton = styled.button`
  ${SharedDeleteCss}
  margin: 46px 0 43px 28px;
  padding: 10px;
  background-color: ${props => props.theme.COLOR.WHITE};
  @media (max-width: 968px) {
    margin-top: 45px;
  }
`;

const ConfirmBoxOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.COLOR.LIGHT_GREY};
  z-index: 20;
`;

export default Overlay;
