import React from "react";
import styled from "styled-components";
import Container from "./container";
import CampaignCreators from "assets/LandingPage/cover-image.png";
import logoimg from "assets/icons/Logo.png";
import { ToastContainer } from "react-toastify";

const LandingPage = props => {
  return (
    <>
      <ToastContainerStyled />
      <Page className="landing-page">
        <PageWrapper>
          <LeftImage
            isAuthenticated={props.isAuthenticated}
            className="left-image"
          >
            <Image className="bg-image" src={CampaignCreators} />
          </LeftImage>
          <RightForm className="right-form">
            <Logo>
              <LogoImage src={logoimg} />
            </Logo>
            <Heading>{props.heading}</Heading>
            <Form>
              <LoginButton type="button" onClick={props.login}>
                Log in
              </LoginButton>
            </Form>
            <Contact>
              <Question>Questions? Please contact</Question>
              <Email href="mailto:Renewal_gen_tool@uhc.com">
                Renewal_gen_tool@uhc.com
              </Email>
            </Contact>
          </RightForm>
        </PageWrapper>
      </Page>
    </>
  );
};

const ToastContainerStyled = styled(ToastContainer)`
  .Toastify__toast {
    display: block;
    position: relative;
    padding: 15px;
    min-height: 50px;
    border-radius: 3px;
  }

  .Toastify__close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
  }
`;
const Page = styled.div`
  * {
    box-sizing: border-box;
  }
`;

const PageWrapper = styled.div`
  max-width: 1250px;
  max-height: 773px;
  margin: 0 auto;
  background-color: ${props => props.theme.COLOR.WHITE};
  @media (min-height: 773px) and (min-width: 1440px) {
    position: fixed;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    top: 50%;
  }
`;

const LeftImage = styled.div`
  width: 54.2%;
  display: ${props => (props.isAuthenticated() ? "none" : "inline-block")};
  vertical-align: top;
  height: 100vh;
  @media (max-width: 768px) {
    width: 100%;
    height: 593px !important;
  }
  @media (max-height: 768px) {
    height: 726px !important;
  }
`;

const Image = styled.img`
  @media (min-width: 1024px) {
    left: -7% !important;
  }
  @media (max-width: 1024px) {
    width: auto !important ;
    left: -14% !important;
  }
`;

const RightForm = styled.div`
  width: calc(43.4% - 5px);
  padding: 199px 1% 0 3.8%;
  background-color: ${props => props.theme.COLOR.WHITE};
  display: inline-block;
  @media (max-width: 768px) {
    margin-top: 0;
    width: 100%;
    text-align: center;
    padding-top: 60px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
`;

const Logo = styled.h1`
  width: 50.4%;
  padding-left: 2px;
  margin-bottom: 48px;
  @media (max-width: 768px) {
    margin: 0 auto;
    width: 26.3%;
  }
`;

const Heading = styled.h2`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 34px;
  width: 90%;
  margin-bottom: 18px;
  font-family: ${props => props.theme.FONT.REG};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  @media (max-width: 948px) {
    font-size: 30px;
    margin: 48px 0 15px;
  }
  @media (max-width: 768px) {
    margin: 0 auto;
    margin-top: 29px;
  }
`;

const Form = styled.form`
  width: 100%;
  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const Contact = styled.div`
  width: 100%;
  margin-bottom: 164px;
  @media (max-width: 948px) {
    margin-top: 40px;
  }
  @media (max-width: 768px) {
    margin-bottom: 59px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px 0 14px;
  margin: 22px 0 42px;
  border-radius: 4px;
  border: 1px solid transparent;
  display: inline-block;
  font-family: ${props => props.theme.FONT.REG};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14);
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  color: ${props => props.theme.COLOR.WHITE};
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.COLOR.WHITE};
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    border: 1px solid ${props => props.theme.COLOR.USER_PRIMARY};
    transition: 0.2s ease-in;
  }
  @media (max-width: 948px) {
    margin: 27px 0 27px;
    font-size: 13px;
  }
  @media (max-width: 1024px) {
    &:hover {
      background-color: ${props => props.theme.COLOR.USER_PRIMARY};
      color: ${props => props.theme.COLOR.WHITE};
      border: 1px solid transparent;
    }
  }
  @media (max-width: 768px) {
    width: 44.3%;
    margin: 12px 0 3px;
  }
`;

const Question = styled.span`
  display: block;
  opacity: 0.6;
  font-size: 12px;
  color: ${props => props.theme.COLOR.MAIN};
  font-family: ${props => props.theme.FONT.REG};
`;

const Email = styled.a`
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.74;
  color: ${props => props.theme.COLOR.MAIN};
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
  font-family: ${props => props.theme.FONT.REG};
  @media (min-width: 1024px) {
    &:hover {
      color: ${props => props.theme.COLOR_PALLETE.GREY};
      transition: 0.2s ease-in;
    }
  }
`;

export default Container(LandingPage);
