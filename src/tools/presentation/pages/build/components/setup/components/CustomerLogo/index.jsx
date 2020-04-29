import React from "react";
import styled from "styled-components";
import { isEmpty } from "lodash";

import SelectedLogo from "./components/SelectedLogo";
import { Delete } from "assets/icons";
import Logo from "./components/Logo";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const CustomerLogo = props => {
  let { customerLogoList, onLogoClick, deleteLogoHandler, contentRepo } = props;
  return (
    <CustomerLogoContainer>
      <LogoPlaceHolderContainer>
        <h2>Customer logo</h2>
        {!isEmpty(contentRepo) ? (
          <SelectedLogo {...props} />
        ) : (
          <WarningText>Please select a content repo. </WarningText>
        )}
      </LogoPlaceHolderContainer>
      <div className="parent">
        <LogoList>
          <div className="image-content">
            {customerLogoList &&
            Array.isArray(customerLogoList) &&
            customerLogoList.length ? (
              customerLogoList.map((item, index) => (
                <LogoImage
                  key={index}
                  isContentRepoSelected={!isEmpty(contentRepo)}
                >
                  <DeleteWrapper title="Delete">
                    <Delete
                      className="delete-logo"
                      onClick={() =>
                        DeleteConfirmationAlert({
                          onYesClick: () =>
                            deleteLogoHandler({
                              deletedLogo: item._id
                            })
                        })
                      }
                    />
                  </DeleteWrapper>
                  <Logo
                    onLogoClick={() => onLogoClick(item._id)}
                    item={item.url}
                  />
                  <CustomerName>{item.title}</CustomerName>
                </LogoImage>
              ))
            ) : (
              <NoDataText>No logos saved in this profile</NoDataText>
            )}
          </div>
        </LogoList>
        <FaddedGradient />
      </div>
    </CustomerLogoContainer>
  );
};

const CustomerLogoContainer = styled.div`
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  background-color: #fff;
  flex-basis: 60.2%;
  position: relative;
  padding-top: 40px;
  h2 {
    font-size: 20px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${props => props.theme.COLOR_PALLETE.GREY};
    opacity: 0.7;
    text-transform: capitalize;
  }
  .parent {
    overflow: hidden;
    position: relative;
    margin-top: 27px;
    box-shadow: inset 0px 12px 23px -15px rgba(0, 0, 0, 0.75);
    padding-left: 40px;
  }
`;

const WarningText = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
  height: 23px;
  display: flex;
  align-items: center;
`;

const LogoPlaceHolderContainer = styled.div`
  padding-left: 40px;
`;

const CustomerName = styled.span`
  font-size: 14px;
  color: ${props => props.theme.COLOR.MAIN};
`;

const DeleteWrapper = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props => props.theme.COLOR.WHITE};
  border-radius: 50%;
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  position: absolute;
  right: -8px;
  cursor: pointer;
  top: -11px;
  svg {
    width: 10.2px;
    height: 12px;
  }
`;

const NoDataText = styled.div`
  display: flex;
  height: 100px;
  align-items: center;
  color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
`;

const LogoList = styled.ul`
  padding: 9px 0;
  .image-content {
    width: 93%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
    @media (min-width: 1245px) {
      width: 100%;
    }
  }
`;

const LogoImage = styled.li`
  width: 30%;
  display: inline-block;
  margin: 11px 0;
  position: relative;
  margin-right: 15px;
  cursor: ${props => (props.isContentRepoSelected ? "pointer" : "default")};
  .delete-logo {
    position: absolute;
    top: -3px;
    right: -3px;
    position: absolute;
    top: 5px;
    right: 6px;
  }
`;

const FaddedGradient = styled.div`
  height: 30px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
  opacity: 0.7;
`;

export default CustomerLogo;
