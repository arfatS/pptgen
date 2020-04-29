import React from "react";
import styled from "styled-components";

//Component
import Accordion from "components/Accordion";
import SlideImage from "../../../SlideImage";

const MainSection = ({ data }) => {
  return (
    <Accordion>
      {data.map((accordionTitle, index) => {
        return (
          <AccordionParent
            key={index}
            header={accordionTitle.categoryName}
            canEdit={true}
            canDelete={true}
            isOpen={index === 0 ? true : false}
            id={`acc${index}`}
            label={`accordion${index}`}
            requiresScrollbar={true}
          >
            <SlideImageContainer>
              {accordionTitle.covers.map((image, index) => {
                return (
                  <SlideImage image={image} key={index} indexValue={index} />
                );
              })}
            </SlideImageContainer>
          </AccordionParent>
        );
      })}
    </Accordion>
  );
};

export default MainSection;

const AccordionParent = styled.div``;

const SlideImageContainer = styled.div`
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: ${props => props.theme.COLOR.WHITE};
`;
