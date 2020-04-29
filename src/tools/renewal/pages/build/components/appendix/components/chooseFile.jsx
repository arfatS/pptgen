import React from "react";
import styled, { css } from "styled-components";
import hexToRgba from "utils/hexToRgba";
import UploadDropZone from "components/chooseFile";

const ChooseFile = props => {
  const { label, isShowError } = props;
  const notice = `NOTE: All appendix items must be 8.5” x 11” in size and may be in a portrait or landscape layout. Landscape layouts will be rotated to fit the document size.`;
  return (
    <ChooseFileWrapper>
      <LabelGroup>
        {label && <Label>{label}</Label>}
        <LabelInput onChange={props.handleInputChange} value={props.fileName} />
      </LabelGroup>
      {isShowError && <Error>{props.errorMsg}</Error>}
      <DropZoneContainer>
        <UploadDropZone
          uploadFileType={"pdf"}
          resource={"appendix"}
          {...props}
        />
        <Note>{notice}</Note>
      </DropZoneContainer>
    </ChooseFileWrapper>
  );
};

ChooseFile.defaultProps = {
  label: "Item Name"
};

const Note = styled.div`
  min-height: 36px;
  margin-top: 11px;
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  opacity: 0.64;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

const DropZoneContainer = styled.div`
  margin-top: 28px;
`;

const Error = styled.span`
  font-size: 12px;
  color: ${props => props.theme.COLOR.ERROR};
  font-weight: bold;
`;

const ChooseFileWrapper = styled.div`
  min-height: 386px;
  width: calc(100% - 30% - 89px);
  padding: 32px 86px 40px;
  float: right;
  background: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  border-radius: 4px;

  @media (min-width: 1000px) and (max-width: 1024px) {
    min-width: 509px;
    width: calc(100% - 346px - 89px);
  }

  @media (max-width: 920px) {
    padding: 35px 56px;
    float: right;
  }
`;

const LabelGroup = styled.div`
  padding-top: ${props => (props.description ? "17px" : 0)};
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.64)};
`;

const sharedInputStyle = css`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 3px;
  padding: 7px 8px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  background: ${props => props.theme.COLOR.INPUT};
  outline: none;
`;

const LabelInput = styled.input`
  ${sharedInputStyle}
`;

export default ChooseFile;
