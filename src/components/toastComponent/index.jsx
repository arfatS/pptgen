import React from "react";
import Styled from "styled-components";

export const ToastComponent = props => {
  return (
    <ToastComponentWrapper>
      <ToastComponentHeading>
        {props.isSuccess ? "Success" : "Error"}
      </ToastComponentHeading>
      <ToastComponentMessage
        dangerouslySetInnerHTML={{ __html: props.message }}
      />
    </ToastComponentWrapper>
  );
};

const ToastComponentWrapper = Styled.div``;
const ToastComponentHeading = Styled.div`
  margin-bottom: 4px;
  font-family: ${props => `${props.theme.FONT.REG}`};
  font-size: 14px;
  font-weight: bold;
`;

const ToastComponentMessage = Styled.div`
  font-family: ${props => `${props.theme.FONT.LATO}`};
  line-height: 1.5;
  font-size: 12px;
  .message {
    font-weight: 900;
  }
`;
