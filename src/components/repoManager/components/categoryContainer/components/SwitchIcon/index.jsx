import React from "react";
import styled from "styled-components";
import { Dropdown } from "assets/icons";

const SwitchIcon = obj => {
  if (!obj.isLeaf) {
    if (obj.expanded) return <StyledDownIcon selected={obj.selected} />;
    else return <StyledRightIcon selected={obj.selected} />;
  }
};

const StyledDownIcon = styled(Dropdown)`
  color: #636363;
`;

const StyledRightIcon = styled(Dropdown)`
  transform: rotate(-90deg);
  color: #636363;
`;

export default SwitchIcon;
