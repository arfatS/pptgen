import React from "react";
import styled from "styled-components";
import { map, each } from "lodash";

import Category from "./components/Cateogry";
import Header from "./components/Header";
import Slides from "./components/Slides";
import Deck from "./components/Deck";

/**
 * Helper function to fetch view tabs data
 * @param {View by topic tab data} data
 */

export const ViewByTopic = props => {
  const { topics, selectSlides, handleDeselect, contentRepo } = props;

  let topicsList = [],
    parentObj = null,
    slidesList = [],
    slideSets = [],
    subHeaderCount = 0,
    groupName = "",
    firstElem = false,
    lastElem = false;

  /**
   * Recursive function to segrigate slides, header, sub-header and category
   * @param {Array} topics Array of object which containes slides data
   */
  const renderTopic = topics => {
    each(topics, (obj, index) => {
      let { _id, title, label, children, group } = obj;
      switch (label) {
        case "category":
          topicsList.push(<Category key={_id} title={title} />);
          parentObj = obj.children;
          break;
        case "header":
          if (slidesList.length) {
            wrapSlides(slidesList, index);
            slidesList = [];
          }
          topicsList.push(<Header key={_id} title={title} />);
          parentObj = obj.children;
          break;
        case "sub-header":
          subHeaderCount = 0;
          each(parentObj.children, childObj => {
            if (childObj.label !== "sub-header") {
              subHeaderCount++;
            }
          });
          if (subHeaderCount === 0) {
            slideSets = [];
            if (index < topics.length) {
              slidesList.push(
                <Deck
                  key={_id}
                  id={_id}
                  title={title}
                  childList={children}
                  {...props}
                />
              );

              if (slidesList.length <= 5) {
                slideSets = seperateTopics(slidesList, true);
              } else {
                slideSets = seperateTopics(splitTopics(slidesList));
              }
            }

            if (index === topics.length - 1) {
              topicsList.push(
                <SlidesHolder key={_id}>{slideSets}</SlidesHolder>
              );
              slidesList = [];
              slideSets = [];
              subHeaderCount = 0;
            }
          } else {
            slidesList.push(
              <Deck
                key={_id}
                id={_id}
                title={title}
                childList={children}
                {...props}
              />
            );
          }
          return null;
        case "slide":
          parentObj = topics;

          if (index < topics.length) {
            if (group && groupName !== group.title) {
              groupName = group.title;
              firstElem = true;
            }
            if (
              (topics[index + 1] &&
                group &&
                topics[index + 1].group &&
                topics[index + 1].group.title !== group.title) ||
              (topics.length - 1 === index &&
                topics[topics.length - 1].group) ||
              (topics[index + 1] && group && !topics[index + 1].group)
            ) {
              lastElem = true;
            }

            slidesList.push(
              <Slides
                firstGroupElem={firstElem}
                lastGroupElem={lastElem}
                adjacentGroupElem={
                  firstElem && topics[index - 1] && topics[index - 1].group
                    ? true
                    : false
                }
                key={_id}
                {...obj}
                slideDetail={obj}
                parentObj={parentObj}
                {...props}
              />
            );

            firstElem = false;
            lastElem = false;
          }

          if (index === topics.length - 1) {
            wrapSlides(slidesList, _id);
            slideSets = [];
            slidesList = [];
          }
          break;
        default:
          break;
      }

      if (Array.isArray(children)) {
        return renderTopic(children);
      }
    });
  };

  const wrapSlides = (slidesList, id) => {
    if (slidesList.length <= 5) {
      slideSets = seperateTopics(slidesList, true);
    } else {
      slideSets = seperateTopics(splitTopics(slidesList));
    }
    topicsList.push(<SlidesHolder key={id}>{slideSets}</SlidesHolder>);
  };

  /**
   * Function to wrap the divided slides
   * @param {Array} renderSet Array of divided slides
   * @param {Boolean} flag Boolean value to render slides without spllitting
   * @returns array of jsx
   */
  const seperateTopics = (renderSet, flag) => {
    if (flag) return <InnerSlidesHolder key={0}>{renderSet}</InnerSlidesHolder>;
    return map(renderSet, (singleSet, index) => {
      if (singleSet.length > 0)
        return <InnerSlidesHolder key={index}>{singleSet}</InnerSlidesHolder>;
    });
  };

  /**
   * Function to divid the provided array in three sets
   * @param {Array} arr array of slided to be divided in three sets
   * @returns array of divided elements
   */
  const splitTopics = arr => {
    let m,
      n,
      splitedArray = [];

    m = Math.ceil(arr.length / 3);
    n = Math.ceil((2 * arr.length) / 3);

    splitedArray.push(arr.slice(0, m));
    splitedArray.push(arr.slice(m, n));
    splitedArray.push(arr.slice(n, arr.length));

    return splitedArray;
  };

  // Recursive function call to make hierarchy of topics
  renderTopic(topics);

  return (
    <>
      <ButtonContainer>
        <DeselectButton
          disabledButton={!(Array.isArray(selectSlides) && selectSlides.length)}
          onClick={handleDeselect}
        >
          Deselect All Slides
        </DeselectButton>
      </ButtonContainer>
      {Array.isArray(topics) && topics.length ? (
        <TabContent>{topicsList}</TabContent>
      ) : (
        <TabContent>
          <NoContentSlide>
            {contentRepo && contentRepo.title
              ? `No content slides available under selected theme.`
              : `Please select content repo.`}
          </NoContentSlide>
        </TabContent>
      )}
    </>
  );
};

const SlidesHolder = styled.div`
  padding-bottom: 26px;
  margin-top: 18px;
`;

const TabContent = styled.div`
  padding: 0 27px 12px 34px;
`;

const DeselectButton = styled.button`
  padding: 4px 18px;
  border: 1px solid ${props => props.theme.COLOR.MAIN};
  border-radius: 4px;
  margin: 22px 22px 0 0;
  position: relative;
  z-index: 1;
  background-color: transparent;
  color: ${props => props.theme.COLOR.HEADING};
  cursor: pointer;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 10px;
  font-weight: bold;
  opacity: 0.7;
  transition: 0.5s all ease;
  pointer-events: ${props => (props.disabledButton ? "none" : "auto")};
  &:hover {
    background: ${props => props.theme.COLOR.HEADING};
    color: ${props => props.theme.COLOR.WHITE};
  }
`;

const InnerSlidesHolder = styled.div`
  width: 30%;
  &:not(:last-of-type) {
    margin-right: 3.7%;
  }
  display: inline-block;
  vertical-align: top;
`;

const ButtonContainer = styled.div`
  text-align: right;
  box-shadow: 0px 9px 9px 0px rgba(255, 255, 255, 1);
`;

const NoContentSlide = styled.p`
  padding: 10px 0;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
`;
