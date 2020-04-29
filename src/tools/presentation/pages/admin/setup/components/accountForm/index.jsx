import React, { Component } from "react";
import container from "./container";
import styled from "styled-components";
import Button from "../button";
import InputField from "../inputField";

class AccountForm extends Component {
  render() {
    let { handleChange, editedData } = this.props;
    return (
      <Wrapper>
        <Float>
          <HeadingContainer>
            <Heading>Account</Heading>
            <SubHeading>Company</SubHeading>
          </HeadingContainer>
          <FloatRight>
            <ButtonWrapper>
              <Button text="Cancel" type="secondary" />
            </ButtonWrapper>
            <Button text="Save" type="primary" />
          </FloatRight>
        </Float>
        <CompanyWrapper>
          <Row>
            <Col>
              <InputField
                placeholder="Company Name"
                name="companyName"
                handleChange={handleChange}
                error={
                  editedData["companyName"] &&
                  editedData["companyName"]["error"]
                }
              />
            </Col>
            <Col />
          </Row>
          <InputSection margintop={18}>
            <InputField
              placeholder="Address 1"
              name="address1"
              handleChange={handleChange}
              error={editedData["address1"] && editedData["address1"]["error"]}
            />
            <InputField
              placeholder="Address 2"
              name="address2"
              handleChange={handleChange}
              error={editedData["address2"] && editedData["address2"]["error"]}
            />
          </InputSection>
          <InputSection margintop={10}>
            <Row>
              <Col>
                <InputField
                  placeholder="City"
                  name="city"
                  handleChange={handleChange}
                  error={editedData["city"] && editedData["city"]["error"]}
                />
              </Col>
              <Col>
                <InputField
                  placeholder="State/Prov"
                  name="state"
                  handleChange={handleChange}
                  error={editedData["state"] && editedData["state"]["error"]}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputField
                  placeholder="Postal Code"
                  name="postalCode"
                  handleChange={handleChange}
                  error={
                    editedData["postalCode"] &&
                    editedData["postalCode"]["error"]
                  }
                />
              </Col>
              <Col>
                <InputField
                  placeholder="Country"
                  name="country"
                  handleChange={handleChange}
                  error={
                    editedData["country"] && editedData["country"]["error"]
                  }
                />
              </Col>
            </Row>
          </InputSection>
        </CompanyWrapper>
        <PrimaryWrapper>
          <SubHeading>Primary contact</SubHeading>
          <Row>
            <Col>
              <InputField
                placeholder="First Name"
                name="firstName"
                handleChange={handleChange}
                error={
                  editedData["firstName"] && editedData["firstName"]["error"]
                }
              />
            </Col>
            <Col>
              <InputField
                placeholder="Last Name"
                name="lastName"
                handleChange={handleChange}
                error={
                  editedData["lastName"] && editedData["lastName"]["error"]
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                placeholder="Email"
                name="email"
                handleChange={handleChange}
                error={editedData["email"] && editedData["email"]["error"]}
              />
            </Col>
            <Col>
              <InputField
                type="number"
                placeholder="Phone"
                name="phone"
                handleChange={handleChange}
                error={editedData["phone"] && editedData["phone"]["error"]}
              />
            </Col>
          </Row>
          <Col>
            <InputField
              placeholder="Support Email"
              name="supportEmail"
              handleChange={handleChange}
              error={
                editedData["supportEmail"] &&
                editedData["supportEmail"]["error"]
              }
            />
          </Col>
        </PrimaryWrapper>
      </Wrapper>
    );
  }
}
export default container(AccountForm);

const Wrapper = styled.div`
  width: 100%;
  padding: 27px 40px 48px;
  border-radius: 4px;
  background-color: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;
`;

const Heading = styled.h2`
  display: block;
  margin-bottom: 7px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  text-align: left;
`;

const SubHeading = styled.span`
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
`;

const CompanyWrapper = styled.div`
  margin-top: 9px;
`;

const PrimaryWrapper = styled.div`
  margin-top: 30px;

  ${SubHeading} {
    margin-bottom: 3px;
  }
`;

const InputSection = styled.div`
  margin-top: ${props => (props.margintop ? props.margintop : "0")}px;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  margin-right: 15px;
`;

const Float = styled.div`
  width: 100%;

  &:after {
    content: "";
    clear: both;
    display: table;
  }
`;

const Row = styled.ul`
  box-sizing: border-box;
`;

const Col = styled.li`
  width: calc(50% - 16px);
  display: inline-block;
  box-sizing: border-box;
  &:nth-of-type(2n + 1) {
    margin-right: 32px;
  }
`;

const FloatRight = styled.div`
  float: right;
`;
const HeadingContainer = styled.div`
  float: left;
`;
