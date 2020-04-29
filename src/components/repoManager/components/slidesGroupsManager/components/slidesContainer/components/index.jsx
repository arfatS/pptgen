import React from "react";
import styled from "styled-components";
import _ from "lodash";

import hexToRgba from "utils/hexToRgba";
import {
  Attach,
  EditWithNoShadow as Edit,
  Lock,
  Unlock,
  Dropdown as DropdownIcon
} from "assets/icons";
import { MdDone, MdClear } from "react-icons/md";

/* Manage Label Input on edit */
export const EnableLabelNameOnEdit = ({
  manageNameInput,
  manageStates,
  currentSelectedSlide,
  saveLevelTitleOnEdit,
  handleInputChange
}) => {
  const { parent: parentId, _id: currentLevelId, title } = currentSelectedSlide;

  const saveSlideName = () => {
    saveLevelTitleOnEdit({
      parentId
    });
    manageStates(manageNameInput);
  };

  const handleInputChangeEvent = e => {
    handleInputChange(e, {
      parentId,
      currentLevelId
    });
  };

  return (
    <LabelNameInputContainer>
      <LabelNameInput
        autoFocus={true}
        defaultValue={title}
        onChange={handleInputChangeEvent}
      />
      <LabelInputActionsComponent>
        <SaveIcon onClick={() => saveSlideName()} />
        <ClearIcon onClick={() => manageStates(manageNameInput)} />
      </LabelInputActionsComponent>
    </LabelNameInputContainer>
  );
};

const LabelNameInputContainer = styled.div`
  margin-top: 3px;
  position: relative;
`;

const LabelInputActionsComponent = styled.span`
  position: absolute;
  top: 0;
  right: 0;
`;

const LabelNameInput = styled.input`
  outline: none;
  border: none;
  border-bottom: 2px solid rgba(33, 94, 255, 0.63);
  width: calc(100% - 46px);
  font-family: ${props => props.theme.FONT.LATO};
  transition: 1s border-bottom ease;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.COLOR.MAIN};
`;

const SaveIcon = styled(MdDone)`
  width: 16px;
  height: 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const ClearIcon = styled(MdClear)`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;
//END

/* Manage Label Name for Display */
export const EnableLabelName = ({
  manageNameInput,
  manageStates,
  currentSelectedSlide
}) => {
  const { title, required } = currentSelectedSlide;
  const enableLevel = required ? <LockIcon /> : <UnLockIcon />;

  return (
    <LabelDisplayContainer>
      <LabelName>{title}</LabelName>
      <LabelActionsComponent>
        <LabelNameEdit onClick={() => manageStates(manageNameInput)}>
          <EditIcon />
        </LabelNameEdit>
        <LabelNameLock>{enableLevel}</LabelNameLock>
      </LabelActionsComponent>
    </LabelDisplayContainer>
  );
};

EnableLabelName.defaultProps = {
  currentSelectedSlide: { title: "No Slide Name", enable: false }
};

const LabelDisplayContainer = styled.div`
  position: relative;
`;

const LabelName = styled.span`
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-transform: capitalize;
`;

const LabelActionsComponent = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
`;

const LabelNameEdit = styled.span`
  margin-right: 15px;
`;

const EditIcon = styled(Edit)`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const LabelNameLock = styled.span``;

const LockIcon = styled(Lock)`
  width: 11px;
  height: 16px;
  transform: translateY(1px);
  cursor: pointer;
`;

const UnLockIcon = styled(Unlock)`
  width: 11px;
  height: 16px;
  transform: translateY(1px);
  cursor: pointer;
`;
//END

/**
 * Parent Slide Container Box
 */
export const SlideDropDown = ({
  parentSlide,
  elemId,
  option,
  selectedValue,
  onDropDownChange
}) => {
  return (
    <ParentSlideComponent parentSlide={parentSlide}>
      <AngleDown htmlFor={elemId}>
        <DropdownIcon />
      </AngleDown>
      <DropDown
        autoFocus={true}
        id={`${elemId}`}
        value={selectedValue || ""}
        onChange={e => {
          onDropDownChange(e);
        }}
        className="category-select"
      >
        {_.map(option, (item, key) => {
          let itemKey = item instanceof Object ? _.get(item, "_id") : item;
          let itemValue = item instanceof Object ? _.get(item, "title") : item;

          return (
            <DropDownOption
              value={key === 0 ? "" : itemKey}
              className="select-options"
              disabled={key === 0}
              key={itemKey + key}
            >
              {itemValue}
            </DropDownOption>
          );
        })}
      </DropDown>
    </ParentSlideComponent>
  );
};

SlideDropDown.defaultProps = {
  parentSlide: false,
  elemId: "parent",
  option: [{ value: "Select Parent", _id: 0 }]
};

const AngleDown = styled.label`
  position: absolute;
  padding-top: 5px;
  right: 0;
  width: 31px;
  height: 20px;
  top: 0;
  z-index: -1;
  height: 30px;
  background: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
`;

const ParentSlideComponent = styled.div`
  margin-top: ${props => (props.parentSlide && "22px") || "7px"};
  position: relative;
  z-index: 10;
  overflow: hidden;
  border-radius: 4px;
  background: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: "";
  }
`;

const DropDown = styled.select`
  width: 100%;
  height: 30px;
  padding: 0 9px;
  border: none;
  border-radius: 4px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
  font-family: ${props => props.theme.FONT.REG};
  background: transparent;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  line-height: 30px;
  cursor: pointer;
  outline: none;
  padding-right: 40px;
`;

const DropDownOption = styled.option``;

//END

/**
 * Slide Description Container
 */

export const DescriptionContainer = ({
  defaultValueInput,
  limit,
  manageSlideComponentStates: onChange
}) => {
  return (
    <DescriptionWrapper>
      <DescriptionInput
        maxLength={limit}
        onChange={onChange}
        defaultValue={defaultValueInput}
      />
      <DisplayLimit>{limit} characters</DisplayLimit>
    </DescriptionWrapper>
  );
};

DescriptionContainer.defaultProps = {
  limit: 250
};

const DescriptionWrapper = styled.div`
  margin-top: 7px;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  padding: 2px 10px;
  border: none;
  outline: none;
  resize: none;
  height: 80px;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
`;

const DisplayLimit = styled.span`
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
`;

//END

/**
 * Group Manager Container
 */

export const GroupManagerContainer = ({
  id,
  title,
  option,
  showAddTextBox,
  onDropDownChange,
  selectedValue
}) => (
  <GroupManagerWrapper>
    <GroupParentDropDown>
      <SlideDropDown
        elemId={id}
        selectedValue={selectedValue}
        option={option}
        onDropDownChange={onDropDownChange}
      />
    </GroupParentDropDown>
    <NewGroupButton onClick={showAddTextBox}>{title}</NewGroupButton>
  </GroupManagerWrapper>
);

GroupManagerContainer.defaultProps = {
  title: "",
  id: "group",
  option: []
};

const GroupManagerWrapper = styled.div``;
const GroupParentDropDown = styled.div`
  width: calc(100% - 93px);
  display: inline-block;
`;

const NewGroupButton = styled.button`
  width: 88px;
  border: none;
  height: 30px;
  border-radius: 4px;
  border: solid 1px ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
  margin-left: 5px;
  outline: none;
  background: transparent;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  cursor: pointer;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  transition: 0.5s ease;
  vertical-align: top;
  display: inline-block;
  margin-top: 7px;
  &:hover {
    background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    color: #fff;
  }
`;

/**
 * Upload Slide Container
 *
 */
export const UploadSlideContainer = ({
  fileName,
  sizeInMb,
  onLayoutUpload,
  layoutLabel
}) => {
  return (
    <UploadSlideWrapper>
      <UploadedSlideFileName
        onClick={() => {
          document.querySelector(`#${layoutLabel}`).click();
        }}
      >
        {fileName}
      </UploadedSlideFileName>
      <UploadFileInputWrapper>
        <UploadFileInput
          id={layoutLabel}
          type={"file"}
          title="Attach"
          data-name={layoutLabel}
          onChange={e => {
            onLayoutUpload(e, e.target.getAttribute("id"));
          }}
          accept="image/x-png,image/jpeg,.ppt, .pptx"
        />
        <UploadButton>
          <AttachIcon />
        </UploadButton>
      </UploadFileInputWrapper>
      <DisplayLimit>Size: {sizeInMb}</DisplayLimit>
    </UploadSlideWrapper>
  );
};

UploadSlideContainer.defaultProps = {
  fileName: null,
  sizeInMb: "20 mb",
  onLayoutUpload: () => {}
};

const UploadSlideWrapper = styled.div`
  padding-top: 7px;
  cursor: pointer;
`;

const UploadedSlideFileName = styled.div`
  width: calc(100% - 35px);
  height: 30px;
  padding: 2px 10px;
  outline: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  display: inline-block;
  vertical-align: top;
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UploadFileInput = styled.input`
  width: 30px;
  height: 30px;
  padding-left: 30px;
  vertical-align: top;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
`;

const UploadFileInputWrapper = styled.div`
  width: 30px;
  display: inline-block;
  vertical-align: top;
  position: relative;
`;

const UploadButton = styled.span`
  width: 30px;
  height: 30px;
  padding: 7px 0;
  display: inline-block;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background: ${props => props.theme.COLOR.USER_PRIMARY};
  text-align: center;
`;

const AttachIcon = styled(Attach)`
  width: 13px;
  height: 13px;
  cursor: pointer;
`;

// END

export const FiltersContainer = ({ filterContent }) => {
  const filterItems = _.map(filterContent, (item, key) => {
    const keys = Object.keys(item);
    return (
      <FilterContentListItem key={key}>
        <FilterTag>{keys[0]}</FilterTag>
        <SlideDropDown option={item[keys[0]]} />
      </FilterContentListItem>
    );
  });

  return <FilterContentList>{filterItems}</FilterContentList>;
};

const FilterContentList = styled.ul`
  margin-top: 4px;
`;

const FilterContentListItem = styled.li`
  margin-bottom: 12px;
`;

const FilterTag = styled.div`
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

// END
