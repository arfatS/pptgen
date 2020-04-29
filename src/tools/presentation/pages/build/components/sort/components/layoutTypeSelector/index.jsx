import React from "react";
import styled from "styled-components";
import { ThumbNail, List } from "assets/icons";
import { map } from "lodash";

const TypeRenderer = (types, selectedLayout, onTypeClick) =>
  map(types, (eachType, index) => (
    <IconWrapper
      title={eachType.label}
      key={index + eachType.value}
      last={types.length === index + 1}
      active={selectedLayout === eachType.value}
      onClick={() => onTypeClick(eachType)}
    >
      {eachType.icon}
    </IconWrapper>
  ));

const LayoutTypeSelector = props => {
  const { selectedLayout, typeList } = props;
  let onTypeClick = selectedType => {
    // Callback on type select
    props.onLayoutSelect && props.onLayoutSelect(selectedType);
  };

  return (
    <LayoutTypeWrapper>
      {TypeRenderer(typeList, selectedLayout, onTypeClick)}
    </LayoutTypeWrapper>
  );
};

LayoutTypeSelector.defaultProps = {
  typeList: [
    {
      label: "Thumbnail",
      value: "thumbnail",
      icon: <ThumbNail />
    },
    {
      label: "List",
      value: "list",
      icon: <List />
    }
  ]
};

export default LayoutTypeSelector;

const LayoutTypeWrapper = styled.div`
  display: inline-block;
`;

const IconWrapper = styled.span`
  cursor: pointer;
  margin-right: ${props => !props.last && "30px"};

  svg {
    vertical-align: middle;

    g {
      fill-opacity: ${props => (props.active ? "1" : "0.5")};
      fill: ${props => props.theme.COLOR.BROWNISH_GREY};
    }
  }

  :hover {
    g {
      fill-opacity: 1;
      fill: ${props => props.theme.COLOR.BROWNISH_GREY};
      transition: 0.2s ease-in-out;
    }
  }
`;
