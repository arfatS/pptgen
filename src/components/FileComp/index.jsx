import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { Docs, Tick, ErrorTriangle } from "assets/icons";
import Loader from "components/loader";

/**
 * File box container
 */
const FileComp = ({ icon, name, loader, height, status, errorMsg }) => {
  // Render different icons according to status
  const checkStatus = status => {
    if (status === "inprogress") {
      return <LoaderContainer>{loader}</LoaderContainer>;
    } else if (status === "completed") {
      return (
        <TickIcon>
          <Tick />
        </TickIcon>
      );
    } else if (status === "failed") {
      return (
        <ErrorIcon>
          <ErrorTriangle />
        </ErrorIcon>
      );
    } else {
      return null;
    }
  };

  // Return null if name is not present
  if (!name) return null;
  return (
    <>
      <FileBox height={height}>
        <Icon>{icon}</Icon>
        <Name title={name}>{name}</Name>
        {checkStatus(status)}
      </FileBox>
      {status === "failed" && errorMsg && <Error>{errorMsg}</Error>}
    </>
  );
};

FileComp.defaultProps = {
  parentSlide: false,
  height: "35px",
  name: "",
  icon: <Docs />,
  loader: <Loader size={15} />,
  status: "completed",
  errorMsg: ""
};

const LoaderContainer = styled.span`
  > div {
    position: absolute;
    top: 50%;
    right: 10px;
    left: unset;
  }
`;

const TickIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);

  svg {
    path {
      fill: ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
    }
  }
`;

const Error = styled.span`
  font-size: 12px;
  font-family: ${props => props.theme.FONT.REG};
  color: ${props => props.theme.COLOR_PALLETE.ERROR};
  text-align: left;
  text-transform: capitalize;
`;

const ErrorIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);

  svg {
    height: 20px;
    width: 20px;
  }
`;

const Icon = styled.span`
  display: inline-block;
  vertical-align: middle;
  line-height: 0;
`;

const Name = styled.span`
  width: 160px;
  padding: 0 25px 0 15px;
  display: inline-block;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.7)};
`;

const FileBox = styled.div`
  max-width: 250px;
  margin-top: 15px;
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.7)};
  font-family: ${props => props.theme.FONT.REG};
  background: ${props => props.theme.COLOR.WHITE};
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  ${props => props.theme.SNIPPETS.BOX_SHADOW_DARK}
  outline: none;
  position: relative;
`;

export default FileComp;
