import React from "react";
import styled from "styled-components";
import Container from "./container";
import UploadOverlay from "../uploadOverlay";
import StepDetails from "components/buildProcess/stepDetails";
import SlideImage from "./components/SlideImage";
import themeData from "./data";
import StepLists from "./components/stepLists";

/**
 * Main library component
 * @param {*} props
 */
const Theme = props => {
  const noteText =
    "Any grayed out covers have been disabled, but not deleted from existing presentations.";
  return (
    <ThemeContainer>
      <ThemeHeader>
        <StepDetails
          _bulkEdit
          _upload
          _gear
          title={"Value Story"}
          description={"Home/Content Repo/Value Story/Themes"}
          className={"step-details"}
          onUpload={() => props.onUploadClick()}
        />
        <ContentContainer>
          <MainSectionContainer>
            <HeaderContainer>
              <ThemeHeading>Themes</ThemeHeading>
            </HeaderContainer>
            <NoteContainer>
              <Note>{`NOTE: ${noteText}`}</Note>
            </NoteContainer>
            <SlideImageContainer>
              {themeData.map((image, index) => {
                return (
                  <SlideImage image={image} key={index} indexValue={index} isMaster={image.isMaster} />
                );
              })}
            </SlideImageContainer>
          </MainSectionContainer>
        </ContentContainer>
      </ThemeHeader>
      <UploadOverlay uploadHeading="Upload New Theme" {...props}>
        <StepLists {...props} />
      </UploadOverlay>
    </ThemeContainer>
  );
};

const ThemeContainer = styled.div`
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  width: ${props => props.theme.WRAPPER.WIDTH};
  margin: 106px auto 30px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};

  @media (max-width: 1024px) {
    width: calc(100% - 80px);
  }

  .step-details {
    border-bottom: none;
  }
`;

const ThemeHeader = styled.div`
  .next-button {
    width: 160px;
  }

  .step-details {
    padding: 37px 0 30px;
    border-bottom: none;

    p {
      text-transform: capitalize;
      font-family: ${props => props.theme.FONT.REG};
      font-weight: bold;
      font-size: 10px;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const MainSectionContainer = styled.div`
  flex-basis: calc(68.5% - 12px);
`;

const HeaderContainer = styled.div`
  padding: 24px 3.85% 24px;
  border-radius: 3px;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  position: relative;
`;

const ThemeHeading = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-weight: bold;
`;

const NoteContainer = styled.div`
  padding: 20px 0 20px 6.6%;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
`;

const Note = styled.span`
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
`;

const SlideImageContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
`;

export default Container(Theme);
