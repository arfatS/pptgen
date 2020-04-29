import React from "react";
import styled from "styled-components";

//Components
import Container from "./container";
import MainSection from "./components/MainSection";
import SideBar from "./components/SideBar";

const Interactivity = () => {
  return (
    <InteractivityContainer>
      <PageTitle>Value Story</PageTitle>
      <BreadCrumbs>Home/Content Repo/Value Story/Interactivity</BreadCrumbs>
      <ContentContainer>
        <MainSectionContainer>
          <MainSection />
        </MainSectionContainer>
        <SideBarContainer>
          <SideBar />
        </SideBarContainer>
      </ContentContainer>
    </InteractivityContainer>
  );
};

const InteractivityContainer = styled.div`
  padding: 40px 0 78px;
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  width: ${props => props.theme.WRAPPER.WIDTH};
  margin: 106px auto 0;
  color: ${props => props.theme.COLOR.MAIN};
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  @media (max-width: 1024px) {
    width: calc(100% - 80px);
  }

  h2,
  h3,
  h4 {
    font-family: ${props => props.theme.FONT.REG};
    font-weight: bold;
  }

  h2 {
    color: ${props => props.theme.COLOR_PALLETE.GREY};
    font-size: 20px;
  }

  h3 {
    color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    font-size: 18px;
  }

  h4 {
    color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    font-size: 14px;
  }
`;

const PageTitle = styled.h2`
  margin-bottom: 10px;
`;

const BreadCrumbs = styled.span`
  margin-bottom: 23px;
  display: block;
  color: ${props => props.theme.COLOR.HEADING};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const MainSectionContainer = styled.div`
  border-radius: 4px;
  margin-right: 2.2%;
  flex-basis: 68.2%;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW}
`;

const SideBarContainer = styled.div`
  min-height: 500px;
  padding: 20px;
  border-radius: 4px;
  flex-basis: 29.56%;
  background: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW}

  p {
    ${props => props.theme.SNIPPETS.FONT_STYLE}
    font-size: 10px;
  }
`;

export default Container(Interactivity);
