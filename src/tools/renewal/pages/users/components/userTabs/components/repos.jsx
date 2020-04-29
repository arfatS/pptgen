import React from "react";
import CheckBox from "components/checkbox";
import styled from "styled-components";

const Repos = rowData => {
  return (
    <RepoWrapper>
      <CheckboxWrapper>
        <CheckBox
          label="Add this new user to all repo (select all)"
          id="access"
        />
      </CheckboxWrapper>
      <LineWrapper>
        <LineBreak />
      </LineWrapper>
      <CheckBoxHeading>
        Select repositories below to grant access.
      </CheckBoxHeading>
      <UserDetails>
        <UserLabel>User</UserLabel>
        <UserName>Joe Smith</UserName>
      </UserDetails>
      <CheckboxWrapper>
        <CheckBox label="Value Story" id="value" />
      </CheckboxWrapper>
      <CheckboxWrapper>
        <CheckBox label="Public Sector" id="public" />
      </CheckboxWrapper>
      <CheckboxWrapper>
        <CheckBox label="Product Decks" id="products" />
      </CheckboxWrapper>
      <ButtonWrapper>
        <AddButton>Save</AddButton>
        <ClearButton>Clear</ClearButton>
      </ButtonWrapper>
    </RepoWrapper>
  );
};

const RepoWrapper = styled.div`
  .save-btn {
    margin-left: 8px;
  }
`;

const CheckBoxHeading = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR.MAIN};
  font-size: 12px;
  margin-top: 27px;
`;

const LineBreak = styled.span`
  width: 91px;
  height: 2px;
  opacity: 0.46;
  border: solid 1px #979797;
  display: inline-block;
`;

const CheckboxWrapper = styled.div`
  margin-top: -7px;
  padding: 10px;
  &:hover {
    background: rgba(65, 171, 193, 0.09);
  }
`;

const LineWrapper = styled.div`
  text-align: center;
`;

const UserDetails = styled.div`
  margin: 10px 0 13px;
`;

const AddButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background-color: ${props => props.theme.COLOR.WHITE};
    border: 1px solid;
  }
`;

const ClearButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  margin-left: 6px;
  background: transparent;
  border: solid 1px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  &:hover {
    color: ${props => props.theme.COLOR.WHITE};
    background-color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  }
`;

const UserLabel = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR.MAIN};
  font-size: 12px;
  font-weight: bold;
  opacity: 0.7;
`;

const UserName = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR.HEADING};
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: inline-block;
  margin-top: 14px;
  button {
    height: 40px;
  }
`;

export default Repos;
