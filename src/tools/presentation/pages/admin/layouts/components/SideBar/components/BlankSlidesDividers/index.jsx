import React from "react";
import styled from "styled-components";
import Container from "./container";
import DividerMaster from "./components/DividerMaster";

const BlankSlidesDividers = () => {
  return (
    <DividerSideBar>
      <SideBarBody>
        <DividerMaster />
      </SideBarBody>
    </DividerSideBar>
  );
};

const DividerSideBar = styled.div`
  background: ${props => props.theme.COLOR.WHITE};
  flex-basis: calc(30.8% - 12px);
`;

const SideBarBody = styled.div``;

export default Container(BlankSlidesDividers);
