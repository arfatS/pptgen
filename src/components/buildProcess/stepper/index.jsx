import React from "react";
import styled from "styled-components";
import { Attach, Cart, SelectRate, Module, Tick } from "assets/icons";
import { includes } from "lodash";

const CreateStepperList = props => {
  const { modifyStep, activeStep, completedSteps, stepItems } = props;

  const stepListItemArray = stepItems;

  // create stepper by step names and config
  const StepListItem = stepListItemArray.map((elem, index) => {
    let isCompleted = includes(completedSteps, index);
    const Icon = isCompleted ? Tick : elem.src;
    return (
      <Step
        onClick={() => index !== activeStep && modifyStep(index)}
        key={index}
        className={index === activeStep ? "active step" : "step"}
        title={elem.title}
      >
        <StepIcon index={index} title={elem.title}>
          <Icon />
        </StepIcon>
        <StepTitle>{elem.title}</StepTitle>
      </Step>
    );
  });

  return <StepList>{StepListItem}</StepList>;
};

CreateStepperList.defaultProps = {
  stepItems: [
    {
      title: "Select Rates",
      src: SelectRate
    },
    {
      title: "Topics",
      src: Module
    },
    {
      title: "Appendix",
      src: Attach
    },
    {
      title: "Build",
      src: Cart
    }
  ],
  modifyStep: () => {},
  activeStep: ""
};

const StepperComponent = props => {
  return (
    <StepperContainer>
      <StepperWrappper>
        <CreateStepperList {...props} />
      </StepperWrappper>
    </StepperContainer>
  );
};

const StepperContainer = styled.div`
  background-color: ${props => props.theme.WRAPPER.STEPPER_COLOR};
  ${props => props.theme.SNIPPETS.FONT_STYLE};
`;

const StepperWrappper = styled.div`
  box-sizing: border-box;
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  max-height: 56px;
  width: ${props => props.theme.WRAPPER.WIDTH};
  margin: 106px auto 0;
  color: ${props => props.theme.COLOR.WHITE};
  @media (max-width: 1024px) {
    padding-left: 13px;
  }
`;

const StepList = styled.ul`
  @media (max-width: 810px) {
    text-align: center;
  }
  .step {
    &.active {
      padding: 0 23px;
      margin-right: 5px;
      font-weight: 900;
      background-color: ${props => props.theme.COLOR.BROWN_GREY};
      opacity: 1;
      position: relative;
      cursor: auto;
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        right: -16px;
        border-top: 10px solid transparent;
        border-left: 10px solid ${props => props.theme.COLOR.BROWN_GREY};
        border-bottom: 10px solid transparent;
        border-right: 10px solid transparent;
        transform: translateY(-50%);
      }
      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: -4px;
        border-top: 10px solid transparent;
        border-left: 10px solid ${props => props.theme.WRAPPER.STEPPER_COLOR};
        border-bottom: 10px solid transparent;
        border-right: 10px solid transparent;
        transform: translateY(-50%);
      }
    }

    /* hide last step icon */
    &:last-of-type {
      &:after {
        display: none;
      }
    }

    /* hide first step */
    &:nth-of-type(1) {
      &:before {
        display: none;
      }
    }
  }
`;

const Step = styled.li`
  box-sizing: border-box;
  min-height: 56px;
  max-height: 56px;
  padding: 0 30px;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  text-align: center;
  opacity: 0.51;
  line-height: 56px;
  @media (max-width: 810px) {
    padding: 0 23px;
  }
`;

const StepIcon = styled.span`
  vertical-align: top;
  display: inline-block;
  padding-top: ${props => (props.index === 4 ? "5px" : "3px")};
`;

const StepTitle = styled.span`
  padding-left: 8px;
  vertical-align: inherit;
`;

export default StepperComponent;
