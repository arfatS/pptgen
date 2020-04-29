import React from "react";
import styled from "styled-components";

const Logo = ({ item, onLogoClick }) => {
  return (
    <LogoContainer>
      <img
        src={item}
        onClick={() => onLogoClick(item._id)}
        alt="Customer Logo"
      />
    </LogoContainer>
  );
};

Logo.defaultProps = {
  onLogoClick: () => {},
  item: {}
};

const LogoContainer = styled.figure`
  * {
    box-sizing: border-box;
  }
  img {
    width: 100%;
    height: 100%;
    max-height: 200px;
    min-height: 50px;
    border: 1px solid #ccc;
    padding: 1px;
  }
`;

export default Logo;
