import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { PreviewCircle } from "assets/icons";

//Components
import Button from "components/button";

let imgSrc = "https://dummyimage.com/237x179/#fff/000000.png";

const UI_STRINGS = {
  SLIDE_DESCRIPTION_TEXT:
    "Content Master determines the location of the logo (so it can be used as a hotspot to link to a Table of Contents page). It also is used to show the location, style, size, color and font to use for a breadcrumb.",
  NOTE_DESCRIPTION_TEXT:
    "NOTE: Location, font, size and style of page number on the Content Master is where page number will be placed on exported presentations."
};

const SideBar = () => {
  return (
    <>
      <SideBarTitle>Content Master</SideBarTitle>
      <ImageContainer>
        <img src={imgSrc} alt="Sample Divider Slide" />
        <IconWrapper title="Preview">
          <PreviewCircle />
        </IconWrapper>
      </ImageContainer>
      <SlideDescription>{UI_STRINGS.SLIDE_DESCRIPTION_TEXT}</SlideDescription>
      <NoteDescription>{UI_STRINGS.NOTE_DESCRIPTION_TEXT}</NoteDescription>
      <SlideInstruction>
        Master divider can be edited on the <Link to="#FIXME">Themes</Link>{" "}
        page.
      </SlideInstruction>
      <Button text="Select Content Master" float="none" width="100%" />
    </>
  );
};

export default SideBar;

const SideBarTitle = styled.h4`
  margin: 0 auto 20px;
  text-align: center;
`;

const ImageContainer = styled.figure`
  margin-bottom: 20px;
  position: relative;
  img {
    width: 100%;
  }
`;

const SlideDescription = styled.p`
  margin-bottom: 15px;
`;

const NoteDescription = styled.p`
  margin-bottom: 15px;
  color: ${props => props.theme.COLOR.HEADING};
`;

const SlideInstruction = styled.p`
  margin-bottom: 40px;

  a {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

const IconWrapper = styled.span`
  position: absolute;
  right: 9px;
  bottom: 9px;
  z-index: 1;
  cursor: pointer;
`;
