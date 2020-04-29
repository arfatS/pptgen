import React from "react";
import styled, { css } from "styled-components";
import { InputBox } from "./inputComponents";
import CheckBox from "components/checkbox";
import ReactHintFactory from "react-hint";
import "react-hint/css/index.css";
import { FaInfoCircle } from "react-icons/fa";
import { includes } from "lodash";
import MultiSelect from "../../MultiSelect.jsx";

const ReactHint = ReactHintFactory(React);

/**
 * render hint on hover
 */
const onRenderContent = (target, content) => {
  return (
    <div className="custom-hint__content">
      <span>{content}</span>
    </div>
  );
};

const rolesList = [
  {
    label: "PG User",
    id: "user",
    name: "pgUser",
    defaultChecked: "true",
    hint: "Select to assign User Role."
  },
  {
    label: "PG Content Admin",
    id: "contentAdmin",
    name: "contentAdmin",
    hint: "Select to assign Content Admin Role."
  },
  {
    label: "PG System Admin",
    id: "systemAdmin",
    name: "systemAdmin",
    hint: "Select to assign System Admin Role."
  },
  {
    label: "Admin",
    id: "rgAdmin",
    name: "rgAdmin",
    hint: "Select to assign Renewal Generator Admin Role."
  },
  {
    label: "Sales",
    id: "rgSales",
    name: "rgSales",
    hint: "Select to assign Renewal Generator Sales Role."
  },
  {
    label: "Underwriter",
    id: "rgUnderwriter",
    name: "rgUnderwriter",
    hint: "Select to assign Renewal Generator Underwriter Role."
  }
];

const UserDetails = props => {
  let {
    firstName,
    lastName,
    email,
    password,
    repeatPassword,
    roles,
    emailAccess,
    stateListValue
  } = props.form;

  if (
    props.location.pathname.indexOf("renewal") !== -1 &&
    rolesList.length === 6
  ) {
    rolesList.splice(0, 3);
  }
  return (
    <UserDetailsWrapper>
      <ReactHint events onRenderContent={onRenderContent} />
      <InputBoxWrapper>
        <InputBox
          type="text"
          name="firstName"
          id="firstName"
          label="First Name*"
          maxLength={50}
          hintData={"First name should not be more than 50 characters."}
          value={firstName.value}
          inputChangeHandler={props.manageInputStates}
        />
        {firstName.error && <ErrorMessage>{firstName.error}</ErrorMessage>}
      </InputBoxWrapper>
      <InputBoxWrapper>
        <InputBox
          type="text"
          name="lastName"
          hintData={"Last name should not be more than 50 characters."}
          id="lastName"
          maxLength={50}
          label="Last Name*"
          value={lastName.value}
          inputChangeHandler={props.manageInputStates}
        />
        {lastName.error && <ErrorMessage>{lastName.error}</ErrorMessage>}
      </InputBoxWrapper>
      <InputBoxWrapper>
        <InputBox
          type="text"
          name="email"
          id="email"
          label="Email*"
          value={email.value}
          inputChangeHandler={props.manageInputStates}
        />
        {email.error && <ErrorMessage>{email.error}</ErrorMessage>}
      </InputBoxWrapper>
      <InputBoxWrapper>
        <InputBox
          type="password"
          name="password"
          id="password"
          hintData={
            "Password must contain at least 8 characters, including Uppercase, Lowercase and Special Character."
          }
          disabled={!!props.editedUserId}
          label="Password*"
          value={props.editedUserId ? "" : password.value}
          inputChangeHandler={props.manageInputStates}
        />

        {password.error && <ErrorMessage>{password.error}</ErrorMessage>}
      </InputBoxWrapper>
      <InputBoxWrapper>
        <InputBox
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          label="Repeat Password*"
          disabled={!!props.editedUserId}
          value={props.editedUserId ? "" : repeatPassword.value}
          inputChangeHandler={props.manageInputStates}
        />
        {repeatPassword.error && (
          <ErrorMessage>{repeatPassword.error}</ErrorMessage>
        )}
      </InputBoxWrapper>

      <MultiSelectWrapper>
        <StateListLabel>State*</StateListLabel>
        <MultiSelect
          value={props.stateListArray ? props.stateListArray : []}
          onChange={props.selectMultipleOption}
          options={props.stateList}
          isMulti={true}
          placeholder={"Select States"}
          getOptionLabel={option => option.state}
          getOptionValue={option => option._id}
          closeMenuOnSelect={false}
          className="react-select-container"
          classNamePrefix="react-select"
          maxMenuHeight={150}
          allowSelectAll={true}
        />
        {stateListValue.error && (
          <ErrorMessage>{stateListValue.error}</ErrorMessage>
        )}
      </MultiSelectWrapper>
      <RadioButtonContainer>
        <RadioWrapperLabel>Role*</RadioWrapperLabel>
        {rolesList.map((item, index) => {
          return (
            <CheckboxWrapper key={index}>
              <CheckBox
                name={item.id}
                label={item.label}
                id={item.id}
                type="roleCheckbox"
                handleChange={e =>
                  props.manageInputStates(e, {
                    propName: item.id,
                    value: e.target.checked,
                    type: "roleCheckbox",
                    label: item.label
                  })
                }
                checked={includes(roles.value, item.label)}
              />
              <IconWrapper>
                <StyledInfoIcon
                  size={12}
                  data-rh={item.hint}
                  data-rh-at="left"
                />
              </IconWrapper>
            </CheckboxWrapper>
          );
        })}
      </RadioButtonContainer>
      {roles.error && <ErrorMessage>{roles.error}</ErrorMessage>}
      <EmailCheckboxWrapper>
        <CheckBox
          label="Email access to user upon saving"
          id="access"
          name="emailAccess"
          type="accessCheckbox"
          handleChange={e => {
            props.manageInputStates(e, {
              propName: "emailAccess",
              value: e.target.checked,
              type: "accessCheckbox",
              label: "Email access to user upon saving"
            });
          }}
          checked={emailAccess.value}
        />
      </EmailCheckboxWrapper>
      <ButtonWrapper>
        <AddButton
          onClick={props.isEdit ? props.saveEditedUser : props.addNewUser}
        >
          Save
        </AddButton>
        <CancelButton onClick={props.resetFormDetails}>Cancel</CancelButton>
      </ButtonWrapper>
    </UserDetailsWrapper>
  );
};

const SharedLabelCss = css`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 10px;
  opacity: 0.64;
  display: inline-block;
  color: ${props => props.theme.COLOR.MAIN};
  font-weight: bold;
  margin-bottom: 9px;
`;

const UserDetailsWrapper = styled.div`
  .save-btn {
    margin-left: 8px;
  }
  .custom-hint__content {
    width: 200px;
    padding: 10px;
    background-color: ${props => props.theme.COLOR.BLACK};
    border-radius: 4px;

    span {
      color: ${props => props.theme.COLOR.WHITE};
    }
  }
  .form-group {
    display: inline-block;
  }
  .checkbox-container {
    display: inline-block;
  }
  .react-select__placeholder {
    ${SharedLabelCss};
    top: 48%;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select-container {
    .react-select__control {
      cursor: pointer;
      min-height: 30px;
      box-shadow: none;
      outline: none;
    }
    .react-select__placeholder {
      ${SharedLabelCss};
      top: 48%;
    }
    .react-select__indicator-separator {
      display: none;
    }
  }
`;

const MultiSelectWrapper = styled.div`
  margin-bottom: 16px;
`;

const IconWrapper = styled.span`
  width: 19px;
  height: auto;
  display: inline-block;
  padding: 5px;
  margin: -5px;
  cursor: pointer;
`;

const InputBoxWrapper = styled.div`
  margin-bottom: 16px;
`;

const ErrorMessage = styled.span`
  font-size: 10px;
  color: ${props => props.theme.COLOR.ERROR};
`;

const AddButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background-color: ${props => props.theme.COLOR.WHITE};
    border: 1px solid;
  }
`;

const CancelButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  margin-left: 6px;
  background: transparent;
  border: solid 1px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  &:hover {
    color: ${props => props.theme.COLOR.WHITE};
    background-color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  }
`;

const RadioButtonContainer = styled.div`
  .checkmark {
    width: 10px;
    height: 10px;
    box-sizing: content-box;
  }
`;

const RadioWrapperLabel = styled.span`
  ${SharedLabelCss};
`;

const StateListLabel = styled.span`
  ${SharedLabelCss};
`;

const CheckboxWrapper = styled.div`
  margin-top: -7px;
  padding: 10px;
  &:hover {
    background: rgba(65, 171, 193, 0.09);
    border-radius: 2px;
  }
`;

const EmailCheckboxWrapper = styled.div`
  padding: 10px;
  margin: 16px 0 20px;
  &:hover {
    background: rgba(65, 171, 193, 0.09);
    border-radius: 2px;
  }
`;

const StyledInfoIcon = styled(FaInfoCircle)`
  margin-top: 2px;
  size: 10px;
  transform: translate(5px, 1px);
  cursor: pointer;
  color: ${props => props.theme.COLOR.MAIN};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: inline-block;
  margin-top: 3px;
`;

export default UserDetails;
