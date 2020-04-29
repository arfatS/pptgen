import React from "react";
import styled from "styled-components";

//Components
import Button from "components/button";
import { EditWithNoShadow, Delete, Drag } from "assets/icons";
import coversList from "../data";

const CoverCategories = () => {
  /**
   *
   * @param {*} coversList
   * Function to return the list of catergories
   */
  const CoversCategoriesData = coversList => {
    return coversList.map(list => {
      return (
        <CategoriesList key={list._id}>
          <DragContainer>
            <Drag />
          </DragContainer>
          <CategoriesListTitle>{list.title}</CategoriesListTitle>
          <Icons>
            <EditWithNoShadow title="Edit" />
            <Delete title="Delete" />
          </Icons>
        </CategoriesList>
      );
    });
  };

  return (
    <CategoriesMain>
      <Button
        buttonClass="add-category"
        text="Add New Category"
        width="85.66%"
        float="unset"
      />
      <CategoriesBody>
        <CatBodyHeading>Available Categories</CatBodyHeading>
        <CategoriesListParent>
          {CoversCategoriesData(coversList)}
        </CategoriesListParent>
      </CategoriesBody>
    </CategoriesMain>
  );
};

const CategoriesMain = styled.div`
  padding-top: 39px;
  border-radius: 4px;
  text-align: center;

  .add-category {
    height: 40px;
    border: solid 1px ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    border-radius: 4px;
    margin-bottom: 39px;
    background: ${props => props.theme.COLOR.WHITE};
    color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    text-align: center;

    &:hover {
      background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
      color: ${props => props.theme.COLOR.WHITE};
    }
  }
`;

const DragContainer = styled.span`
  position: absolute;
  top: 52%;
  left: 10px;
  transform: translateY(-50%);
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

const CategoriesListParent = styled.ul``;

const CategoriesList = styled.li`
  padding: 10px 10px 10px 30px;
  margin-bottom: 10px;
  border-radius: 2px;
  background: ${props => props.theme.COLOR.LIGHT_BLUE};
  cursor: move;
  position: relative;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const CategoriesListTitle = styled.span`
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-size: 12px;
  font-weight: bold;
`;

const Icons = styled.div`
  position: absolute;
  top: 9px;
  right: 9px;
  svg {
    width: 16px;
    height: auto;
    color: ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
    cursor: pointer;

    &:first-of-type {
      margin-right: 12px;
    }
  }
`;

export default CoverCategories;
