import React from "react";
import styled from "styled-components";

import SlideImage from "../../../SlideImage";

const BlankSlidesDividers = ({ data }) => {
  return (
    <SlideImageContainer>
      {data.map((image, index) => {
        return <SlideImage image={image} key={index} indexValue={index} />;
      })}
    </SlideImageContainer>
  );
};

export default BlankSlidesDividers;

const SlideImageContainer = styled.div`
  padding: 20px 0 73px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: ${props => props.theme.COLOR.WHITE};
`;
