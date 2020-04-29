import React, { Component } from "react";
import styled from "styled-components";

import { Dropdown, EditWithNoShadow, Delete } from "assets/icons";
import ShadowScrollbars from "components/custom-scrollbars/ShadowScrollbars";

class AccordionContent extends Component {
  accordionClick = () => {
    this.props.accordionHandler(this.props.label);
  };

  render() {
    const {
      header,
      canEdit,
      canDelete,
      isActive,
      children,
      requiresScrollbar,
      editHandler
    } = this.props;

    let childContent = requiresScrollbar ? (
      <ShadowScrollbars autoHeight={true} autoHeightMax={500}>
        {children}
      </ShadowScrollbars>
    ) : (
      { children }
    );
    return (
      <AccordionContainer>
        <AccordionHeader
          isActive={isActive}
          onClick={this.accordionClick}
          requiresScrollbar={requiresScrollbar}
        >
          <EditIconWrapper isActive={isActive}>
            <Dropdown />
          </EditIconWrapper>

          {canEdit && (
            <IconWrapper right="58px">
              <EditWithNoShadow onClick={editHandler} />
            </IconWrapper>
          )}

          {canDelete && (
            <IconWrapper right="20px">
              <Delete onClick={editHandler} />
            </IconWrapper>
          )}

          {header}
        </AccordionHeader>
        {isActive && this.props.children && childContent}
      </AccordionContainer>
    );
  }
}

const AccordionContainer = styled.div`
  svg {
    width: 100%;
    height: 100%;
  }

  &:first-child {
    h3 {
      border-top: none;
    }
  }
`;

const EditIconWrapper = styled.span`
  width: 12px;
  height: 8px;
  position: absolute;
  top: 50%;
  left: 8.7%;
  transform: translateY(-50%);
  top: ${props => (props.isActive ? `43%` : `60%`)};
  transform: ${props =>
    props.isActive
      ? "translateY(-50%) rotate(0)"
      : "translateY(-50%) rotate(180deg)"};
  cursor: pointer;
`;

const AccordionHeader = styled.h3`
  padding: 17px 0 17px 12.7%;
  position: relative;
  background-color: ${props =>
    props.isActive
      ? props.theme.COLOR_PALLETE.ACCORDION_ACTIVE
      : props.theme.COLOR.WHITE};
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  font-weight: bold;
  border-top: 1px solid ${props => (props.isActive ? "transparent" : "#f0f0f0")};
  box-shadow: ${props =>
    props.requiresScrollbar && props.isActive
      ? "0px 5px 8px 0 rgba(0,0,0,0.14)"
      : "none"};
  z-index: 1;
`;

const IconWrapper = styled.span`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  right: ${props => (props.right ? props.right : "auto")};
  left: ${props => (props.left ? props.left : "auto")};
  transform: translateY(-50%);
  cursor: pointer;
`;

export default AccordionContent;
