import React from "react";
import styled from "styled-components";

//Components
import Covers from "./components/Covers";
import BlankSlidesDividers from "./components/BlankSlidesDividers";
import Sidebar from "../SideBar/index";

import { SecondaryButton } from "components/button";

const MainSection = props => {
  let { data, isCover, noteText } = props;
  return (
    <ContentContainer className="content-container">
      <MainSectionContainer>
        {isCover ? (
          <CollapseContainer>
            <SecondaryButton
              buttonClass="collapse-all"
              text="Collapse All"
              width="auto"
              float="unset"
            />
          </CollapseContainer>
        ) : null}

        <NoteContainer>
          <Note>{`NOTE: ${noteText}`}</Note>
        </NoteContainer>
        {isCover ? <Covers data={data} /> : <BlankSlidesDividers data={data} />}
      </MainSectionContainer>
      <Sidebar {...props} />
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const MainSectionContainer = styled.div`
  background-color: ${props => props.theme.COLOR.WHITE};
  flex-basis: calc(68.5% - 12px);
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
`;

const CollapseContainer = styled.div`
  padding: 21px 0 21px 2.5%;
  position: relative;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};

  .collapse-all {
    padding: 4px 18px;
  }
`;

const NoteContainer = styled.div`
  padding: 9px 0 12px 6.6%;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
`;

const Note = styled.span`
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
`;

export default MainSection;
