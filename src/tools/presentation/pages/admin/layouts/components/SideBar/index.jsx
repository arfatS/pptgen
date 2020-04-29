import React from "react";
import styled from "styled-components";

//Components
import Container from "./container";
import Covers from "./components/Covers";
import BlankSlidesDividers from "./components/BlankSlidesDividers";

const SideBar = props => {
  let { data, isCover } = props;
  return (
    <SidebarWrapper>
      {isCover ? <Covers data={data} /> : <BlankSlidesDividers data={data} />}
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  background: ${props => props.theme.COLOR.WHITE};
  flex-basis: calc(31.33% - 12px);
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
`;

export default Container(SideBar);
