import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Gear, AngleDown, Search } from "assets/icons";

import hexToRgba from "utils/hexToRgba";
import ValidationUtils from "utils/ValidationUtils";
import Loader from "components/loader";
/**
 * Form to create category in modules
 * @param {Boolean} dropDownActive
 * @param {Function} setDropDownActive
 * @param {Function} onDragStartHeaderCategory
 *
 */

const CategoryForm = ({
  dropDownActive,
  setDropDownActive,
  onDragStartHeaderCategory,
  addNewCategory,
  openModuleContainer
}) => {
  const [categoryValue, setCategoryValue] = useState(false);
  const [errorValue, setErrorValue] = useState("");
  const [isLoading, setLoadingValue] = useState(false);

  let categoryInputRef = null;

  // Validate category
  const checkValidInput = value => {
    if (ValidationUtils.checkIfspecialChar(value)) {
      setErrorValue("Please do not enter the special character.");
      return false;
    } else if (!categoryInputRef.value) {
      setErrorValue("This field is required.");
      return false;
    } else if (!categoryInputRef.value.trim()) {
      setErrorValue("Please enter a valid name.");
      return false;
    } else {
      setErrorValue("");
      return true;
    }
  };

  return (
    <CategoryContainer isActive={dropDownActive}>
      <AddSlide
        onClick={() => {
          openModuleContainer && openModuleContainer();
          setDropDownActive(!dropDownActive);
        }}
        divider={true}
      >
        Add Topic
      </AddSlide>
      {dropDownActive && (
        <LabelGroup>
          <CategoryInputWrapper>
            <CategoryInput
              ref={ref => (categoryInputRef = ref)}
              error={categoryValue}
              placeholder="Enter Category Name"
            />
            {errorValue && <ErrorValue>{errorValue}</ErrorValue>}
          </CategoryInputWrapper>
        </LabelGroup>
      )}
      <SlideAddContainer>
        <AddSlide
          isLoading={isLoading}
          onClick={() => {
            if (isLoading) return null;
            if (
              !(categoryInputRef && checkValidInput(categoryInputRef.value))
            ) {
              setCategoryValue(true);
            } else {
              setCategoryValue(false);
              setLoadingValue(true);
              // callback on new category added
              let data = {
                title: categoryInputRef.value.trim(),
                enable: true
              };
              addNewCategory({
                data,
                onSuccess: () => {
                  setLoadingValue(false);
                  setDropDownActive(false);
                },
                onError: () => {
                  setLoadingValue(false);
                }
              });
            }
          }}
        >
          Add Category
        </AddSlide>
        {isLoading ? (
          <LoaderContainer>
            <Loader size={10} />
          </LoaderContainer>
        ) : (
          <CancelSlide
            title="Cancel"
            onClick={() => {
              setDropDownActive(!dropDownActive);
            }}
          >
            x
          </CancelSlide>
        )}
      </SlideAddContainer>
    </CategoryContainer>
  );
};

/**
 * Header category component to add module/category
 * @param {Function} manageStates
 */

const CategoryDropDownContainer = ({ manageStates, ...props }) => {
  const [dropDownActive, setDropDownActive] = useState(false);
  const { onDragStartHeaderCategory, addNewCategory } = props;

  //module form handler for buttons
  const openModuleContainer = () => {
    setDropDownActive(false);
    manageStates({
      propName: "createNewModule",
      value: false,
      //reset form fields selected to edit if clicked to add new module
      cb: () => {
        manageStates({
          propName: "currentSelectedSlide",
          value: null
        });
        manageStates({
          propName: "createNewModule",
          value: true
        });
      }
    });
  };

  return (
    <AddButtonContainer>
      <PopupWrapper
        onClick={e => setDropDownActive(false)}
        isActive={dropDownActive}
      />
      {dropDownActive && (
        <CategoryForm
          dropDownActive={dropDownActive}
          setDropDownActive={setDropDownActive}
          onDragStartHeaderCategory={onDragStartHeaderCategory}
          addNewCategory={addNewCategory}
          openModuleContainer={openModuleContainer}
        />
      )}
      <AddButtonWrapper onClick={openModuleContainer}>
        <AddButton>Add</AddButton>
      </AddButtonWrapper>
      <DropDownContainer
        onClick={() => {
          setDropDownActive(!dropDownActive);
        }}
        title="Click to add a new topic/category"
      >
        <DropDownIcon />
      </DropDownContainer>
    </AddButtonContainer>
  );
};

const SlideAddContainer = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const DividerCSS = css`
  &::after {
    content: "";
    width: 110%;
    position: absolute;
    bottom: -10px;
    left: -5%;
    border-top: 1px solid #d8d3d3;
  }
`;

const AddSlide = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS};
  width: ${props => (props.divider ? "100%" : `calc(80% - 3px)`)};
  height: 30px;
  margin-bottom: ${props => (props.divider ? "20px" : 0)};
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  opacity: ${props => (props.isLoading ? "0.8" : "1")};
  cursor: ${props => (props.isLoading ? "initial" : "pointer")};
  position: relative;
  ${props => props.divider && DividerCSS}
`;

const CancelSlide = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS};
  width: calc(20% - 3px);
  height: 30px;
  margin-left: 6px;
  font-size: 16px;
  background: transparent;
  border: solid 1px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  transform: translateY(-2px);
  display: inline-block;
  line-height: 0;
  padding: 11px 0 15px;
`;

const LoaderContainer = styled.div`
  width: calc(20% - 3px);
  height: 30px;
  margin-left: 6px;
  position: relative;
  display: inline-block;
  vertical-align: top;
  top: 5px;
  left: 5px;
  > div {
    position: absolute;
    z-index: 10;
    top: 10px;
    left: 3px;
  }
`;

const LabelGroup = styled.div`
  > div {
    display: ${props => (props.upload ? "inline-block" : "block")};
    vertical-align: top;
    width: ${props => (props.upload ? "88%" : "auto")};
  }
  padding-top: ${props => (props.description ? "17px" : 0)};
`;

const CategoryInputWrapper = styled.div``;

const CategoryInput = styled.input`
  height: 30px;
  padding: 2px 10px;
  outline: none;
  border-radius: 4px;
  border: solid 1px
    ${props =>
      props.error
        ? props.theme.COLOR_PALLETE.ERROR
        : "rgba(151, 151, 151, 0.4)"};
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 1)};
  width: 100%;
`;

const CategoryContainer = styled.div`
  padding: 15px;
  opacity: ${props => (props.isActive ? "1" : "0")};
  visibility: ${props => (props.isActive ? "visible" : "hidden")};
  width: 200px;
  background-color: ${props => props.theme.COLOR.WHITE};
  position: absolute;
  right: 0;
  top: 50px;
  z-index: 30;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  text-align: left;
  &:after {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    top: -10px;
    right: 10px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid rgb(255, 255, 255);
  }
`;

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
  display: ${props => (props.isActive ? "block" : "none")};
`;

const AddButtonContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 160px;
  position: relative;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
`;

const AddButtonWrapper = styled.ul`
  display: inline-block;
  width: 117px;
  height: 40px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  font-weight: 900;
  font-style: normal;
  font-stretch: normal;
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  color: ${props => props.theme.COLOR.WHITE};
  font-family: ${props => props.theme.FONT.REG};
  line-height: 38px;
  font-size: ${props => props.theme.SIZE.MAIN};
`;

const AddButton = styled.li``;

const DropDownContainer = styled.button`
  width: 43px;
  display: inline-block;
  padding: 0;
  border: none;
  outline: none;
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  font-size: 24px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  height: 40px;
  filter: grayscale(35%);
  vertical-align: top;
  cursor: pointer;
`;

const ErrorValue = styled.span`
  font-size: 10px;
  font-family: ${props => props.theme.FONT.REG};
  color: ${props => props.theme.COLOR_PALLETE.ERROR};
  text-align: left;
`;

const DropDownIcon = styled(AngleDown)`
  transform: translateY(-3px);
`;

const HeaderComponent = ({
  repoTitle,
  settings,
  addActive,
  search,
  createNewModule,
  ...props
}) => {
  return (
    <Header>
      <>
        <TitleAndSearchContainer>
          {repoTitle && <Repotitle>{repoTitle}</Repotitle>}
        </TitleAndSearchContainer>
        <SubContainer>
          {settings && (
            <SettingWrapper>
              <Setting />
            </SettingWrapper>
          )}
          {addActive && (
            <CategoryDropDownContainer
              createNewModule={createNewModule}
              manageStates={props.manageStates}
              {...props}
            />
          )}
        </SubContainer>
      </>
      {search && (
        <SearchBoxWrapper>
          <SearchIcon size={20} />
          <SearchBox
            placeholder="Search..."
            onChange={props.handleRepoSearch}
          />
        </SearchBoxWrapper>
      )}
    </Header>
  );
};

HeaderComponent.defaultProps = {
  repoTitle: "Content Repo 0.2.2",
  settings: false,
  addActive: false,
  search: false
};

const TitleAndSearchContainer = styled.div`
  float: left;
  width: 75.4%;
  &:after {
    content: " ";
    visibility: hidden;
    display: block;
    height: 0;
    clear: both;
  }
  @media (max-width: 1024px) {
    width: 648px;
  }
`;

const Header = styled.div`
  margin-top: 30px;
  &:after {
    content: " ";
    visibility: hidden;
    display: block;
    height: 0;
    clear: both;
  }
`;

const Repotitle = styled.h2`
  opacity: 0.9;
  font-family: "Maven Pro", sans-serif;
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => props.theme.COLOR.HEADING};
  display: inline-block;
  padding-top: 8px;
`;

const SearchBoxWrapper = styled.div`
  width: 380px;
  display: inline-block;
  margin: 20px 0 25px;
  border-radius: 4px;
  border: solid 1px ${hexToRgba("#cbcbcb", 0.51)};
  background-color: ${hexToRgba("#e6e6e6", 0.51)};
  position: relative;
`;

const SearchBox = styled.input`
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  text-indent: 38px;
  font-size: 14px;
  font-weight: normal;
  font-family: ${props => props.theme.FONT.REG};
`;

const SearchIcon = styled(Search)`
  color: ${props => props.theme.COLOR.MAIN};
  transform: translate(12px, 2px);
  position: absolute;
  top: 11px;
  left: 0;
`;

const SettingWrapper = styled.span`
  width: 40px;
  height: 40px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid;
  border-color: ${props => props.theme.COLOR.MAIN};
  cursor: pointer;
  text-align: center;
  padding-top: 11px;
  margin-right: 20px;
`;

const Setting = styled(Gear)`
  font-size: 19px;
  color: ${props => props.theme.COLOR.MAIN};
`;

const SubContainer = styled.div`
  float: right;
`;

export default HeaderComponent;
