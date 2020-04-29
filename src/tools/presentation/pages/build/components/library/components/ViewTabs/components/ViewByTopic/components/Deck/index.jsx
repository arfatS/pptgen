import React from "react";
import styled, { css } from "styled-components";
import { map, each, includes } from "lodash";
import Checkbox from "components/checkbox";
import container from "./container";

const Deck = ({
  title,
  id,
  childList,
  expand,
  handleParentCheckbox,
  handleExpandDeck,
  selectSlides,
  handleCheckBoxChange,
  addPresentation
}) => {
  let selectedSlides = [],
    groupName = "",
    firstElem = false,
    lastElem = false;

  each(childList, ({ _id }) => {
    if (selectSlides.indexOf(_id) > -1 && !includes(selectedSlides, _id)) {
      selectedSlides.push(_id);
    }
  });

  const renderChild = map(childList, (item, index) => {
    let { title, _id, group } = item;
    if (group && groupName !== group.title) {
      groupName = group.title;
      firstElem = true;
    }
    if (
      (childList[index + 1] &&
        group &&
        childList[index + 1].group &&
        childList[index + 1].group.title !== group.title) ||
      (childList.length - 1 === index &&
        childList[childList.length - 1].group) ||
      (childList[index + 1] && group && !childList[index + 1].group)
    ) {
      lastElem = true;
    }

    let className = `${group ? "group" : ""} ${firstElem ? "first" : ""} ${
      firstElem && childList[index - 1] && childList[index - 1].group
        ? "adjacent-group"
        : ""
    } ${lastElem ? "last" : ""}`;

    firstElem = false;
    lastElem = false;

    return (
      <DeckList className={className} key={index}>
        <Checkbox
          label={title}
          id={_id}
          checked={selectedSlides.indexOf(_id) > -1 ? true : false}
          handleChange={e => {
            handleCheckBoxChange(
              e.target.checked,
              _id,
              (group && group.title) || "",
              childList,
              item
            );
          }}
          useButton={true}
          addPresentation={() => addPresentation(_id, childList, item)}
        />
      </DeckList>
    );
  });

  return (
    <DeckHolder>
      <DeckHeader
        className={`${
          selectedSlides.length === childList.length ? "full-selected" : ""
        } ${selectedSlides.length > 0 ? "partial-selected" : ""}`}
      >
        <Expand onClick={handleExpandDeck} expand={expand}></Expand>
        <Checkbox
          label={title}
          id={id}
          checked={selectedSlides.length > 0 ? true : false}
          handleChange={handleParentCheckbox}
          deck={true}
        />
      </DeckHeader>
      {expand && expand ? <DeckListHolder>{renderChild}</DeckListHolder> : ""}
    </DeckHolder>
  );
};

const BorderCSS = css`
  content: "";
  width: 100%;
  height: 2px;
  display: block;
  position: absolute;
  background-color: ${props => props.theme.COLOR_PALLETE.COOL_BLUE};
  opacity: 0.3;
`;

const DeckHolder = styled.div`
  width: 100%;
  display: inline-block;
  vertical-align: top;

  .group {
    background: #eef7f9;
    &:first-of-type {
      padding-top: 4px;
    }
  }

  .first {
    padding-top: 4px;
    position: relative;

    &:not(:first-child) {
      margin-top: 2px;
    }

    &:after {
      ${props => props.theme.SNIPPETS.BOX_SHADOW_DARK};
      ${BorderCSS};
      top: 0;
    }
  }

  .group:not(:first-of-type).adjacent-group {
    margin-top: 10px;
  }

  .last {
    padding-bottom: 7px;
    position: relative;
    &:before {
      ${BorderCSS};
      bottom: 0;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.38);
    }
  }
`;

const DeckHeader = styled.div`
  width: 100%;
  display: inline-block;
  position: relative;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  .checkbox-container {
    width: 100%;
    padding: 4px 0 4px 12px;
    display: inline-block;

    label {
      width: 80%;
      display: inline-block;
      vertical-align: middle;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &.partial-selected {
    input {
      background-color: ${props => props.theme.COLOR.USER_PRIMARY};
      border: solid 2px ${props => props.theme.COLOR.USER_PRIMARY};

      &::after {
        display: none;
      }
    }
  }

  &.full-selected {
    input {
      &::after {
        display: block;
      }
    }
  }
`;

const Expand = styled.button`
  width: 10px;
  height: 10px;
  border: none;
  display: inline-block;
  position: absolute;
  left: -6px;
  top: 52%;
  transform: translateY(-50%);
  background-color: transparent;
  outline: none;
  cursor: pointer;
  &:after {
    content: "";
    width: 12px;
    height: 2px;
    display: ${props => (!props.expand ? "block" : "none")};
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: ${props => props.theme.COLOR_PALLETE.COOL_BLUE};
    transform: translate(-50%, -50%) rotate(270deg);
  }
  &:before {
    content: "";
    width: 12px;
    height: 2px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: ${props => props.theme.COLOR_PALLETE.COOL_BLUE};
    transform: translate(-50%, -50%);
  }
`;

const DeckListHolder = styled.ul`
  margin-left: 11%;
`;

const DeckList = styled.li`
  .checkbox-container {
    padding: 4px 12px;
  }

  button {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

export default container(Deck);
