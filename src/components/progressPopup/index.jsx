import React, { Component } from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import handleBodyScroll from "utils/handleBodyScroll";

// First way to import
import { ClipLoader } from "react-spinners";

class ProgressPopup extends Component {
  componentDidMount() {
    handleBodyScroll({ action: "open" });
  }

  componentWillUnmount() {
    handleBodyScroll({ action: "close" });
  }

  static defaultProps = {
    isPopupOpen: false,
    text: "Please wait while we generate your document…"
  };

  render() {
    let { isPopupOpen, text } = this.props;

    return (
      <PopupWrapper isActive={isPopupOpen}>
        <ContentBox isActive={isPopupOpen}>
          <Loader>
            <ClipLoader
              sizeUnit={"px"}
              size={25}
              margin={"2px"}
              color={"#123abc"}
              loading={true}
            />
          </Loader>
          <TextWrapper>
            <Text>{text}</Text>
          </TextWrapper>
        </ContentBox>
      </PopupWrapper>
    );
  }
}

export default ProgressPopup;

const Loader = styled.div`
  margin-right: 10px;
`;

const TextWrapper = styled.div``;

const Text = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
  display: ${props => (props.isActive ? "block" : "none")};
`;

const ContentBox = styled.ul`
  height: 76px;
  width: 276px;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => (props.isActive ? "1" : "0")};
  visibility: ${props => (props.isActive ? "visible" : "hidden")};
  background-color: ${props => props.theme.COLOR.WHITE};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;
`;
