import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import ShadowScrollbars from "components/custom-scrollbars/ShadowScrollbars";

/**
 *
 * @param {sidebarIn} overlay state
 * @param {children} lists children
 */
const UploadOverlay = ({
  sidebarIn,
  children,
  uploadHeading,
  closeOverlaySidebar
}) => {
  return (
    <OverlayContainer
      onClick={e => closeOverlaySidebar(e)}
      className={sidebarIn}
    >
      <SideBar onClick={e => e.stopPropagation()}>
        <UploadHeading>{uploadHeading}</UploadHeading>
        <ShadowScrollbars style={{height: 600 }}>
          <Accordion>
            <Steps>
              <StepsContainer>{children}</StepsContainer>
            </Steps>
          </Accordion>
        </ShadowScrollbars>
      </SideBar>
    </OverlayContainer>
  );
};

const OverlayContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${hexToRgba("#000", 0.4)};
  position: absolute;
  z-index: 10;
  top: 106px;
  bottom: 0;
  left: 0;
  display: none;

  &.fade-in {
    display: block;
  }
`;

const SideBar = styled.div`
  width: 326px;
  height: 100%;
  padding: 40px 0 0 20px;
  background-color: #fff;
  position: absolute;
  z-index: 5;
  right: 0;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
`;

const UploadHeading = styled.span`
  padding-right: 20px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.HEADING};
  opacity: 0.7;
  display: block;
  margin-bottom: 22px;
`;

const Accordion = styled.div``;

const Steps = styled.div``;

const StepsContainer = styled.ul`
  padding-right: 20px;
`;

export default UploadOverlay;
