import React, { Component } from "react";
import styled from "styled-components";
import { UploadHeader, Add } from "assets/icons";
import logoImage from "assets/icons/Logo.png";

import Profile from "./components/Profile";
import Hamburger from "./components/Hamburger";
import { Link } from "react-router-dom";
import container from "./container";
import hexToRgba from "utils/hexToRgba";
import DropDown from "./components/Dropdown";
import { map } from "lodash";

class Header extends Component {
  static defaultProps = {
    logo: logoImage,
    isLoading: true,
    notiCount: 0,
    _library: {
      handleClick: () => {
        console.log("library");
      }
    }
  };

  _renderList = ({ name, value, ...otherData }) => {
    let {
      menuOptions,
      isActiveMenu,
      handleMenuItemClick,
      _checkUserAcess
    } = this.props;

    let MenuList;
    MenuList = map(menuOptions[value], (item, key) => {
      if (!_checkUserAcess(item.accessTo)) {
        return null;
      }

      return (
        <ListItem
          key={`${item + key}`}
          onClick={e => {
            handleMenuItemClick({ event: e, value: item.value });
          }}
          title={item.name}
        >
          <MenuItem
            to={item.link}
            className={item.value === isActiveMenu ? "active" : ""}
          >
            <MenuIcon>{item.icon}</MenuIcon>
            <MenuItemText isShowHelperText={!!item.helperText}>
              {item.name}
            </MenuItemText>
            {item.helperText && <HelperText>{item.helperText}</HelperText>}
          </MenuItem>
        </ListItem>
      );
    });
    return MenuList;
  };

  _renderIcon = ({ checkIfProps, icon, handleClick, title }) => {
    if (checkIfProps) {
      return (
        <IconWrapper title={title} onClick={e => handleClick && handleClick(e)}>
          {icon}
        </IconWrapper>
      );
    }
  };

  render() {
    let {
      logo,
      selectedDropDown,
      userProfileMeta: profile,
      notiCount,
      handleMenuClick,
      isOpen,
      _addNew,
      _upload,
      isHeaderSticky,
      handleSelectClick,
      onProfileClick,
      isProfileOpen,
      onToolSelected,
      toolOptions,
      scrollBarWidth,
      resetPasswordRouteActive
    } = this.props;
    // Check if profile data has been saved in store
    let $isLoading = profile && !Object.keys(profile).length;

    // Show loader
    return (
      <HeaderContainer
        isSticky={isHeaderSticky}
        isOpen={isOpen}
        scrollBarWidth={scrollBarWidth}
      >
        <LeftWrapper resetPasswordRouteActive={resetPasswordRouteActive}>
          {!resetPasswordRouteActive && (
            <HamburgerWrapper>
              <Hamburger handleMenuClick={handleMenuClick} isActive={isOpen} />
            </HamburgerWrapper>
          )}
          <LogoWrapper to={"/home"}>
            <Logo src={logo} title="UnitedHealthcare" />
          </LogoWrapper>
        </LeftWrapper>
        {!$isLoading && !resetPasswordRouteActive && (
          <>
            <RightWrapper>
              {this._renderIcon({
                checkIfProps: _addNew,
                icon: <Add />,
                handleClick: _addNew && _addNew.handleClick,
                title: "Create"
              })}
              {this._renderIcon({
                checkIfProps: _upload,
                icon: <StyledUploadHeader />,
                handleClick: _upload && _upload.handleClick,
                title: "Add"
              })}
              {/* {this._renderIcon({
            checkIfProps: _library,
            icon: <StyledLibrary />,
            handleClick: _library && _library.handleClick,
            title: "Library"
          })} */}
              <IconWrapper title="Notification">
                {notiCount !== 0 && (
                  <NotiCount>
                    {/* Check Noti count is 0  */}
                    <Count>{notiCount}</Count>
                  </NotiCount>
                )}
                {/* <StyledBell /> */}
              </IconWrapper>
              <Profile
                profile={profile || {}}
                isLoading={$isLoading}
                onProfileClick={onProfileClick}
              />
            </RightWrapper>
            <MenuWrapper
              onClick={() => handleSelectClick({ value: false })}
              isSticky={isHeaderSticky}
              isOpen={isOpen}
            >
              <TopWrapper>
                <DropdownWrapper>
                  <DropDown
                    elemId={"parent"}
                    option={toolOptions}
                    height={40}
                    onClickOptionSelect={onToolSelected}
                    {...this.props}
                  />
                </DropdownWrapper>
                <ListWrapper>
                  {this._renderList(selectedDropDown || {})}
                </ListWrapper>
              </TopWrapper>
              <BottomWrapper>
                <FooterItem href="mailto:Renewal_gen_tool@uhc.com">
                  Support
                </FooterItem>
              </BottomWrapper>
            </MenuWrapper>
            <BlurredWrapper
              isSticky={isHeaderSticky}
              isOpen={isOpen}
              isProfileOpen={isProfileOpen}
              onClick={e => handleMenuClick({ action: "close" })}
            >
              <BgBlur />
            </BlurredWrapper>
          </>
        )}
      </HeaderContainer>
    );
  }
}

export default container(Header);

const LeftWrapper = styled.div`
  display: flex;
  margin-left: ${props => (props.resetPasswordRouteActive ? "3.5%" : 0)};
`;

const HamburgerWrapper = styled.div`
  display: inline-block;
  margin-right: 40px;
`;

const MenuWrapper = styled.div`
  width: 250px;
  height: ${props =>
    props.isSticky ? `calc(100vh - 66px)` : `calc(100vh - 108px)`};
  padding: 20px 0 30px;
  position: absolute;
  background-color: ${props => props.theme.COLOR.WHITE};
  top: ${props => (props.isSticky ? `65px` : `105px`)};
  left: ${props => (props.isOpen ? `0` : `-250px`)};
  bottom: 0;
  z-index: 2;
  overflow-x: hidden;
  visibility: ${props => (props.isOpen ? `visible` : `hidden`)};
  transition: all 0.3s ease-in;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 4px;
    outline: 1px solid slategrey;
  }
`;

const MenuIcon = styled.span`
  display: inline-block;
  margin-right: 12px;
`;

const BlurredWrapper = styled.div`
  width: calc(100% - 250px);
  height: ${props =>
    props.isSticky ? `calc(100vh - 66px)` : `calc(100vh - 105px)`};
  position: absolute;
  top: ${props => (props.isSticky ? `65px` : `105px`)};
  right: 0;
  bottom: 0;
  opacity: ${props => (props.isOpen ? `1` : `0`)};
  z-index: ${props => (props.isOpen ? `2` : `-10`)};
  background-color: transparent;
  overflow: hidden;
  visibility: ${props => (props.isOpen ? `visible` : `hidden`)};
  display: ${props => (props.isProfileOpen ? `none` : `block`)};
  transition: opacity 0.2s ease-in;
  transition-delay: 0.3s;
`;

const BgBlur = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
`;

const HeaderContainer = styled.div.attrs({
  className: "header"
})`
  padding: ${props => (props.isSticky ? `13px 30px` : `33px 30px`)};
  position: fixed;
  left: 0;
  right: ${props => `${props.scrollBarWidth}px`};
  top: 0;
  z-index: 21;
  background-color: ${props => props.theme.COLOR.WHITE};
  display: flex;
  justify-content: space-between;
  transition: padding 0.2s ease-in;
  ${props => props.theme.SNIPPETS.BOX_SHADOW}
`;

const LogoWrapper = styled(Link)`
  max-width: 196px;
  display: inline-block;
  text-decoration: none;
  box-sizing: border-box;
`;

// const StyledBell = styled(Bell)`
//   width: 32px;
//   height: 26px;
// `;

const StyledUploadHeader = styled(UploadHeader)`
  width: 34px;
  height: 26px;
`;

// const StyledLibrary = styled(Library)`
//   width: 23px;
//   height: 28px;
// `;

const IconWrapper = styled.div`
  margin-right: 36px;
  position: relative;
  svg {
    path {
      fill: ${props => props.theme.COLOR.USER_PRIMARY};
    }
    rect {
      fill: ${props => props.theme.COLOR.USER_PRIMARY};
      stroke: ${props => props.theme.COLOR.USER_PRIMARY};
    }
  }
  cursor: pointer;
`;

const NotiCount = styled.div`
  height: 14px;
  width: 14px;
  background-color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
  position: absolute;
  top: 0;
  right: 0;
  text-align: center;
  border-radius: 50%;
`;

const Count = styled.span`
  color: ${props => props.theme.COLOR.WHITE};
  font-family: ${props => props.theme.FONT.HEEBO};
  font-size: 10px;
  display: inline-block;
  transform: translateY(-2px);
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 100%;
  display: block;
`;

const ListWrapper = styled.ul`
  box-sizing: border-box;
`;

const ListItem = styled.li`
  box-sizing: border-box;
  margin-bottom: 10px;

  .active {
    border-left: 2px solid ${props => props.theme.COLOR.USER_PRIMARY};
    background-color: ${props =>
      hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.09)};

    @media screen and (max-width: 768px) {
      border-left: 2px solid ${props => props.theme.COLOR.USER_PRIMARY};
      background-color: ${props =>
        hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.09)};
    }
  }
`;

const BottomWrapper = styled.div`
  margin: 0 30px;
`;

const TopWrapper = styled.div``;

const MenuItem = styled(Link)`
  padding: 12px 0 10px 32px;
  border-left: 2px solid transparent;
  display: flex;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  font-weight: bold;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.54)};
  text-decoration: none;
  text-transform: capitalize;
  position: relative;
  &:hover {
    border-left: 2px solid ${props => props.theme.COLOR.USER_PRIMARY};
    background-color: ${props =>
      hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.09)};
  }

  @media screen and (max-width: 768px) {
    &:hover:not(.active) {
      border-left: 2px solid transparent;
      background-color: transparent;
    }
  }
`;

const MenuItemText = styled.span`
  margin-top: ${props => (props.isShowHelperText ? "-5px" : "")};
`;

const HelperText = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 10px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.54)};
  position: absolute;
  top: 21px;
  left: 58px;
`;

const FooterItem = styled.a`
  display: block;
  padding-top: 20px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
  border-top: 1px solid
    ${props => hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, 0.3)};
  text-decoration: none;
  text-transform: capitalize;
`;

const DropdownWrapper = styled.div`
  padding: 0 30px;
  margin-bottom: 26px;
  max-width: 350px;
`;
