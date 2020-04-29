import React from "react";
import styled from "styled-components";

import { EditSquare, Delete, Preview, Download } from "assets/icons";

const SlideImage = ({ image, indexValue }) => {
  return (
    <ImageBlock enable={image.enable}>
      <Image src={image.thumbnailLocation} />
      <div className="logo-controls">
        <IconWrapper>
          <EditSquare />
        </IconWrapper>
        <IconWrapper>
          <Delete />
        </IconWrapper>
        <IconWrapper className="preview" title="Preview">
          <Preview />
        </IconWrapper>
        <IconWrapper>
          <Download />
        </IconWrapper>
      </div>
      <DraggableIndex>{indexValue + 1}</DraggableIndex>
    </ImageBlock>
  );
};

const ImageBlock = styled.div`
  padding: 4px 6px 4px 4px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  margin: 0 2.3% 20px 0;
  flex-basis: 20.5%;
  position: relative;
  opacity: ${props => (props.enable ? 1 : 0.4)};
  cursor: ${props => (props.enable ? "auto" : "not-allowed")};

  &:nth-child(4n) {
    margin-right: 0;
  }

  .logo-controls {
    display: flex;
    justify-content: space-between;
    padding: 8px 8px 4px;
    svg {
      width: 15px;
      height: 16px;
      color: ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
      cursor: pointer;
    }

    .preview {
      svg {
        width: 23px;
      }
    }
  }
`;

const Image = styled.img`
  width: 100%;
  border: 1px solid #d9d9d9;
`;

const IconWrapper = styled.span``;

const DraggableIndex = styled.span`
  box-sizing: border-box;
  width: 23px;
  height: 23px;
  padding-top: 1px;
  border: 3px solid ${props => props.theme.COLOR.WHITE};
  border-radius: 50%;
  position: absolute;
  top: 4px;
  right: 2px;
  background: ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
  color: ${props => props.theme.COLOR.WHITE};
  font-size: 11px;
  text-align: center;
`;

export default SlideImage;
