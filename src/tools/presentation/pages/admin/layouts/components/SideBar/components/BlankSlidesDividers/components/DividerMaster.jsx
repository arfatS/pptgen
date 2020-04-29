import React from "react";
import styled from "styled-components";
import Button from "components/button";

import { PreviewCircle } from "assets/icons";
import { Link } from "react-router-dom";

import hexToRgba from "utils/hexToRgba";

let imgSrc = "https://via.placeholder.com/237x179";

const DividerMaster = () => {
  return (
    <DividersMain>
      <DividersBody>
        <DividerBodyHeading>Divider Master</DividerBodyHeading>
        <DividerContainer>
          <DividerSlide>
            <SlideImage src={imgSrc}></SlideImage>
            <IconWrapper title="Preview">
              <PreviewCircle />
            </IconWrapper>
          </DividerSlide>
          <DividerInfo>
            <InfoPara>
              Master divider determines where the divider title will be placed.
            </InfoPara>
            <InfoPara>
              Note: You must use the field [Divider Title] on the master.
            </InfoPara>
            <InfoPara>
              Master divider can be edited on the{" "}
              <Link title="Themes" to="#FIXME">
                Themes
              </Link>{" "}
              page.
            </InfoPara>
          </DividerInfo>
        </DividerContainer>
      </DividersBody>
      <Button text="Select Divider Master " width="85.66%" float="unset" />
    </DividersMain>
  );
};

const DividersMain = styled.div`
  padding-top: 19px;
  border-radius: 4px;
  text-align: center;
`;

const DividersBody = styled.div`
  width: 85.66%;
  margin: 0 auto;
`;

const DividerBodyHeading = styled.span`
  padding-bottom: 4px;
  border-bottom: 3px solid ${hexToRgba("#215eff", 0.63)};
  margin-bottom: 8px;
  display: inline-block;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-weight: bold;
`;

const DividerContainer = styled.div``;

const DividerSlide = styled.figure`
  margin-bottom: 19px;
  position: relative;
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const DividerInfo = styled.div`
  margin-bottom: 38px;
`;

const InfoPara = styled.p`
  margin-bottom: 9px;
  color: ${props => props.theme.COLOR.HEADING};
  font-size: 10px;
  line-height: 1.4;
  text-align: left;

  &:last-of-type {
    margin-bottom: 0;
  }

  a {
    text-decoration: underline;
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    cursor: pointer;
    transition: 0.5s all linear;

    &:hover {
      text-decoration: none;
    }
  }
`;

const IconWrapper = styled.span`
  position: absolute;
  right: 9px;
  bottom: 6px;
  z-index: 1;
  cursor: pointer;
`;

export default DividerMaster;
