import React from "react";
import styled from "styled-components";

//components
import Container from "./container";

//styles
const ResetPassowordContainer = styled.div`
  padding: 48px 35px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-size: 14px;
  max-width: 1250px;
  margin: 150px auto 0;
  p:nth-of-type(1) {
    margin-bottom: 20px;
  }
`;

const WelcomeMessage = styled.h3`
  font-weight: bold;
  padding-bottom: 25px;
  font-size: 20px;
`;

const ActionMessage = styled.p``;

const ChangePassword = styled.button`
  margin: 30px 0 35px;
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS};
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  border-radius: 8px;
  width: auto;
  height: auto;
  font-size: 14px;
  font-weight: 600;
  border-radius: 3px;
  padding: 10px 40px;
`;

const constants = {
  welcome: "Welcome to the Renewal Generator Tool!",
  emailSentMessage:
    "An email with a secure link to reset your password and get started was just sent.<br/> Please check your email to continue.",
  actionMessage:
    "If you haven’t received the email after a few minutes, please click button below.",
  changePassword: "Resend my password reset email",
  note:
    "Note- On click of the button, you will receive an email with the link in your registered email address. You can further click on the link in your email to proceed with setting up your new password."
};

const ResetPassoword = ({ resetPasswordEvent }) => {
  return (
    <>
      <ResetPassowordContainer>
        <WelcomeMessage>{constants.welcome}</WelcomeMessage>
        <ActionMessage
          dangerouslySetInnerHTML={{ __html: constants.emailSentMessage }}
        />
        <ActionMessage>{constants.actionMessage}</ActionMessage>
        <ChangePassword onClick={resetPasswordEvent}>
          {constants.changePassword}
        </ChangePassword>
      </ResetPassowordContainer>
    </>
  );
};

export default Container(ResetPassoword);
