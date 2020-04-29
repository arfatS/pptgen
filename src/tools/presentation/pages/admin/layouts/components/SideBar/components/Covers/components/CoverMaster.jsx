import React from "react";
import styled from "styled-components";
import Button from "components/button";
import { PreviewCircle } from "assets/icons";
import { Link } from "react-router-dom";

const CoverMaster = () => {
  return (
    <CategoriesMain>
      <CategoriesBody>
        <CoverMasterFigure>
          <CoverMasterImg
            src="https://via.placeholder.com/237x161"
            alt="Cover Master"
          />
          <CoverMasterNumber>1</CoverMasterNumber>
          <PreviewContainer title="Preview">
            <PreviewCircle />
          </PreviewContainer>
        </CoverMasterFigure>
        <CoverMasterInfo>
          <InfoPara>
            Master cover determines the fields to be shown on all covers. Any
            text fields on the master cover in brackets will be included as
            dynamic fields and the location and styles applied to that will be
            used.
          </InfoPara>
          <InfoPara>
            Note: Using the field [Presentation Date] will automatically show
            the user a calendar to select the date.
          </InfoPara>
          <InfoPara>
            Master cover can be edited on the{" "}
            <Link title="Themes" to="#FIXME">
              Themes
            </Link>{" "}
            page.
          </InfoPara>
        </CoverMasterInfo>
        <CatBodyHeading>Available fields</CatBodyHeading>
        <CategoriesFieldsParent>
          <CategoriesField>Title</CategoriesField>
          <CategoriesField>Presentation Date</CategoriesField>
          <CategoriesField>Presenter Name</CategoriesField>
          <CategoriesField>Customer</CategoriesField>
        </CategoriesFieldsParent>
      </CategoriesBody>
      <Button
        buttonClass="select-cover"
        text="Select Cover Master "
        width="85.66%"
        float="unset"
      />
    </CategoriesMain>
  );
};

const CategoriesMain = styled.div`
  padding-top: 39px;
  border-radius: 4px;
  text-align: center;

  .select-cover {
    height: 40px;
    border-radius: 4px;
    margin-bottom: 39px;
    text-align: center;
  }
`;

const CategoriesBody = styled.div`
  width: 85.66%;
  margin: 0 auto;
  text-align: left;
`;

const CatBodyHeading = styled.span`
  margin-bottom: 10px;
  display: block;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-weight: bold;
`;

const CategoriesField = styled.li`
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 5px;
  background-color: ${props => props.theme.COLOR.LIGHT_BLUE};
  color: ${props => props.theme.COLOR.HEADING};
  font-size: 12px;
  font-weight: bold;
  opacity: 0.74;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const CategoriesFieldsParent = styled.ul`
  margin-bottom: 20px;
`;

const CoverMasterInfo = styled.div`
  margin-bottom: 22px;
`;

const CoverMasterFigure = styled.figure`
  margin-bottom: 17px;
  position: relative;
  border: solid 0.5px ${props => props.theme.COLOR.BORDER_GREY};
`;

const PreviewContainer = styled.div`
  svg {
    position: absolute;
    z-index: 5;
    right: 10px;
    bottom: 10px;
    cursor: pointer;
  }
`;

const CoverMasterImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const CoverMasterNumber = styled.figcaption`
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  padding-top: 1px;
  border: 4px solid #fff;
  border-radius: 100%;
  position: absolute;
  z-index: 5;
  top: 0;
  right: 0;
  background: #979797;
  color: #fff;
  font-size: 17px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

export default CoverMaster;
