import React from "react";
import styled from "styled-components";

import Container from "./container";
import StepDetails from "components/buildProcess/stepDetails";
import SetupDetails from "./components/SetupDetails";
import CustomerLogo from "./components/CustomerLogo";

const Setup = props => {
  return (
    <>
      <SetupContainer>
        <StepDetails
          title={"Setup"}
          onNext={() => props.nextStepHandler(1)}
          _next={true}
          {...props}
        />
        <div className="content">
          <SetupDetails {...props} />
          <CustomerLogo {...props} />
        </div>
      </SetupContainer>
    </>
  );
};

const SetupContainer = styled.div`
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  margin: 0 auto;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  margin-bottom: 50px;
  .content {
    margin-top: 40px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

export default Container(Setup);
