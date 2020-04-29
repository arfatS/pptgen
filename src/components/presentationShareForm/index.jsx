//Lib
import React from "react";
import styled, { css } from "styled-components";

//Components
import Container from "./container";
import hexToRgba from "utils/hexToRgba";
import Checkbox from "components/checkbox";
import RadioButton from "components/radioBtn";
import { Close } from "assets/icons";

const presentationShareForm = ({
  noteCharsRemaining,
  manageInputStates,
  handleRemoveItem,
  form,
  emailItems,
  handleInputKeyDown,
  handleValidation,
  submitText,
  showcheckbox,
  checkboxLabel,
  overlayHandler,
  shareDescription,
  showRadioBtn,
  formHandler,
  emailInput,
  checkboxChange,
  isLoading,
  selectedPresentation
}) => {
  const focusInput = () => {
    emailInput.current.focus();
  };
  const { pptLocation, pdfLocation } = selectedPresentation;

  return (
    <ConfirmBoxWrapper>
      <ConfirmBoxOverlay onClick={overlayHandler} />
      <ConfirmBox className="form-overlay">
        <CloseIconWrapper>
          <CloseIcon onClick={overlayHandler} />
        </CloseIconWrapper>
        <MainHeading>Share</MainHeading>
        <RadioWrapper>
          <RadioButtonHeading>
            {shareDescription
              ? shareDescription
              : "Choose the format below to share the presentation"}
          </RadioButtonHeading>
          {showRadioBtn && (
            <>
              {pptLocation && pptLocation.url && (
                <RadioButtonWrapper>
                  <RadioButton
                    name="options"
                    label="PowerPoint (.PPTX)"
                    id="ppt"
                    defaultChecked={true}
                    handleChange={e =>
                      manageInputStates({
                        propName: "presentationOptions",
                        value: "ppt"
                      })
                    }
                  />
                </RadioButtonWrapper>
              )}
              {pdfLocation && pdfLocation.url && (
                <RadioButtonWrapper>
                  <RadioButton
                    name="options"
                    label="PDF"
                    id="pdf"
                    handleChange={e =>
                      manageInputStates({
                        propName: "presentationOptions",
                        value: "pdf"
                      })
                    }
                  />
                </RadioButtonWrapper>
              )}
            </>
          )}
        </RadioWrapper>
        <DescriptionWrapper>
          <DescriptionHeading>Enter email address*</DescriptionHeading>
          <InputWrapper>
            <EmailList
              onClick={() => focusInput(emailInput)}
              emailItems={emailItems.length}
            >
              {emailItems.map((email, index) => {
                return (
                  <Email key={index} isIncorrect={handleValidation(email)}>
                    <EmailText>{email}</EmailText>
                    <Cross onClick={() => handleRemoveItem(index)}>x</Cross>
                  </Email>
                );
              })}
              <Input
                type="text"
                name="email"
                value={form.email.value}
                onKeyDown={handleInputKeyDown}
                ref={emailInput}
                onChange={e =>
                  manageInputStates({
                    propName: "email",
                    value: e.target.value
                  })
                }
              />
            </EmailList>
            <HelperText>
              To send to multiple users, press ENTER after addresses.
            </HelperText>
            {form.email.error ? <Error>{form.email.error}</Error> : null}
          </InputWrapper>
          {showcheckbox && (
            <CheckboxWrapper>
              <Checkbox label={checkboxLabel} handleChange={checkboxChange} />
            </CheckboxWrapper>
          )}
          <TextBoxWrapper>
            <TextBoxHeading>Add a custom note</TextBoxHeading>
            <TextArea
              maxLength={500}
              onChange={e =>
                manageInputStates({ propName: "note", value: e.target.value })
              }
            />
            <TextAreaHelperText>
              {noteCharsRemaining - form.note.value.length} characters remaining
            </TextAreaHelperText>
          </TextBoxWrapper>
          <ShareButton
            onClick={() => formHandler()}
            isLoading={isLoading}
            disabled={isLoading ? true : false}
          >
            {isLoading ? "Sending" : submitText}
          </ShareButton>
        </DescriptionWrapper>
      </ConfirmBox>
    </ConfirmBoxWrapper>
  );
};

presentationShareForm.defaultProps = {
  overlayHandler: () => {},
  submitText: "Share"
};

const SharedHelperTextCss = css`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 10px;
  color: ${props => props.theme.COLOR.HEADING};
  opacity: 0.8;
  margin-top: 7px;
  display: inline-block;
`;

const ShareButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  width: 100%;
  margin-top: 30px;
  opacity: ${props => (props.isLoading ? 0.5 : 1)};
  cursor: ${props => (props.isLoading ? "not-allowed" : "pointer")};

  &:hover {
    color: ${props =>
      props.isLoading
        ? props.theme.COLOR.WHITE
        : props.theme.COLOR.USER_PRIMARY};
    background-color: ${props =>
      props.isLoading
        ? props.theme.COLOR.USER_PRIMARY
        : props.theme.COLOR.WHITE};
    border: ${props => (props.isLoading ? "none" : "1px solid")};
  }
`;

const Email = styled.li`
  display: inline-block;
  background-color: ${props =>
    !props.isIncorrect
      ? props.theme.COLOR_PALLETE.LIPSTICK
      : props.theme.COLOR_PALLETE.LIGHT_GREY};
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 10px;
  color: ${props => props.theme.COLOR.WHITE};
  padding: 5px;
  margin: 2px;
  border-radius: 3px;
  max-width: 99%;
`;

const EmailText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 94%;
  vertical-align: bottom;
`;

const Cross = styled.span`
  font-size: 9px;
  transform: scale(1.7) translateY(-0.5px);
  margin-left: 10px;
  display: inline-block;
  padding-bottom: 2px;
  cursor: pointer;
  color: ${props => props.theme.COLOR_PALLETE.WHITE};
`;

const EmailList = styled.ul`
  width: 100%;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
  padding: ${props => (props.emailItems !== 0 ? "" : "5px 3px")};
  cursor: text;
`;

const SharedHeadingTextCss = css`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  color: ${props => props.theme.COLOR.HEADING};
  font-weight: bold;
  opacity: 0.64;
  margin-bottom: 4px;
  display: inline-block;
`;

const DescriptionWrapper = styled.div`
  width: 50%;
  display: inline-block;
`;

const DescriptionHeading = styled.span`
  ${SharedHeadingTextCss};
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const CheckboxWrapper = styled.div`
  width: 100%;
  margin: 29px 0 28px;
`;

const HelperText = styled.p`
  ${SharedHelperTextCss};
`;

const TextAreaHelperText = styled.span`
  ${SharedHelperTextCss};
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  display: inline-block;
  min-width: 5px;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-family: ${props => props.theme.FONT.LATO};
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
  font-size: 12px;
`;

const TextBoxHeading = styled.span`
  ${SharedHeadingTextCss};
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  padding: 3px;
  resize: none;
  height: 80px;
  border-radius: 4px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  &:focus {
    outline: none;
  }
`;

const TextBoxWrapper = styled.div`
  margin-top: 25px;
`;

const MainHeading = styled.span`
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  opacity: 0.7;
  font-weight: bold;
  font-size: 30px;
  color: ${props => props.theme.COLOR.HEADING};
  margin-bottom: 20px;
`;

const ConfirmBoxWrapper = styled.div`
  * {
    box-sizing: border-box;
  }
`;

const RadioButtonWrapper = styled.div`
  margin-top: 9px;
  label {
    opacity: 0.8;
    color: ${props => props.theme.COLOR.HEADING};
  }
  .checkmark {
    width: 10px;
    height: 10px;
    box-sizing: content-box;
  }
`;

const RadioWrapper = styled.div`
  width: 50%;
  display: inline-block;
  vertical-align: top;
`;

const RadioButtonHeading = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  opacity: 0.8;
  font-size: 12px;
  color: ${props => props.theme.COLOR.HEADING};
  margin-bottom: 25px;
  width: 70%;
`;

const ConfirmBox = styled.div`
  width: 66.51%;
  padding: 31px 40px 37px;
  position: fixed;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.COLOR.WHITE};
  z-index: 20;
  @media (max-width: 968px) {
    width: 518px;
  }
  @media (min-width: 1025px) {
    width: 681px;
  }
`;

const CloseIcon = styled(Close)`
  transform: translate(-50%, -50%);
  margin-left: 50%;
  margin-top: 50%;
  width: 26px;
  height: 26px;
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: -14px;
  right: -13px;
  background-color: ${props => props.theme.COLOR.WHITE};
  width: 34px;
  border-radius: 50%;
  height: 34px;
  cursor: pointer;
`;

const ConfirmBoxOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
  z-index: 20;
`;

const Error = styled.span`
  position: absolute;
  bottom: -10px;
  left: 0;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.ERROR, "1")};
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 10px;
  font-weight: normal;
  pointer-events: none;
`;

export default Container(presentationShareForm);
