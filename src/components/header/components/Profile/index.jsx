import React, { Component } from "react";
import styled from "styled-components";
import container from "./container";
import hexToRgba from "utils/hexToRgba";
import { Link } from "react-router-dom";

class Profile extends Component {
  _renderOptions = () => {
    let { options } = this.props;
    let $list = options.map((listitem, index) => {
      const { clickEvent, name, link, icon, isActive } = listitem;

      return (
        isActive && (
          <ListItem title={name} to={link} onClick={clickEvent} key={index}>
            <ListIcon>{icon}</ListIcon>
            <ListText>{name}</ListText>
          </ListItem>
        )
      );
    });
    return $list;
  };

  render() {
    let {
      getInitials,
      isLoading,
      profile,
      handlePopup,
      isPopupOpen
    } = this.props;
    if (isLoading) {
      return (
        <UserIcon isLoading={isLoading}>
          <Name />
        </UserIcon>
      );
    }
    return (
      <>
        <UserIcon
          onClick={e => {
            handlePopup({ event: e, action: "open" });
          }}
        >
          <Name>{getInitials(profile.name)}</Name>
          <PopupWrapper
            onClick={e => handlePopup({ event: e, action: "close" })}
            isActive={isPopupOpen}
          />
          <ProfileOptions isActive={isPopupOpen}>
            <Header>
              <Text title={profile.name}>{profile.name}</Text>
            </Header>
            {this._renderOptions()}
          </ProfileOptions>
        </UserIcon>
      </>
    );
  }
}

export default container(Profile);

const Name = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  line-height: unset;
  font-weight: bold;
  font-size: 20px;
  position: absolute;
  color: ${props => props.theme.COLOR.WHITE};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-transform: uppercase;
  transition: 0.5s all ease;
`;

const UserIcon = styled.div`
  height: 40px;
  width: 40px;
  position: relative;
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  border: 2px solid transparent;
  border-radius: 50%;
  user-select: none;
  transition: 0.5s all ease;
  ${props =>
    !props.isLoading &&
    `
    cursor: pointer;
    &:hover {
      background-color: ${props => props.theme.COLOR.WHITE};
      border: 2px solid ${props => props.theme.COLOR.USER_PRIMARY};

      ${Name} {
        color: ${props => props.theme.COLOR.USER_PRIMARY};
      }
    }
  `}
`;

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
  display: ${props => (props.isActive ? "block" : "none")};
`;

const ProfileOptions = styled.ul`
  padding-bottom: 15px;
  opacity: ${props => (props.isActive ? "1" : "0")};
  visibility: ${props => (props.isActive ? "visible" : "hidden")};
  width: 200px;
  background-color: ${props => props.theme.COLOR.WHITE};
  position: absolute;
  right: 0;
  top: 50px;
  z-index: 3;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};

  &:after {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    top: -10px;
    right: 10px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid rgb(255, 255, 255);
  }
`;

const Header = styled.li`
  padding: 16px;
  box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.14);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
`;

const Text = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  font-size: 16px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  vertical-align: top;
`;

const ListItem = styled(Link)`
  padding: 15px 17px 12px;
  text-decoration: none;
  display: block;
  transition: 0.5s all ease;

  &:hover {
    text-decoration: underline;
  }
  svg {
    width: 10px;
    height: 10px;
  }
`;

const ListText = styled.span`
  margin-left: 9px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
`;

const ListIcon = styled.span`
  display: inline-block;
  transform: translateY(1px);
`;
