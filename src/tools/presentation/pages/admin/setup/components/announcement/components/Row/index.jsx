import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import Moment from "react-moment";

import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const Row = props => {
  let {
    _id,
    title,
    date,
    handleListClick,
    index,
    onActionClick,
    icon,
    length,
    name
  } = props;

  let _handleIconClick = e => {
    e.stopPropagation();
    DeleteConfirmationAlert({
      onYesClick: () => onActionClick({ id: _id, title })
    });
  };

  return (
    <BodyRow
      key={_id}
      title={name}
      isfirst={index === 0}
      onClick={() => handleListClick({ id: _id, title })}
    >
      <BorderWrapper isLast={index === length - 1}>
        <MainCol>{title}</MainCol>
        <BodyCol>
          <Moment format="MM/DD/YYYY">{date}</Moment>
        </BodyCol>
        {icon && (
          <LastCol>
            <IconBg onClick={_handleIconClick}>{icon}</IconBg>
          </LastCol>
        )}
      </BorderWrapper>
    </BodyRow>
  );
};

export default Row;

Row.defaultProps = {
  index: 0
};

const BorderWrapper = styled.div`
  height: 47px;
  border-bottom: 0.5px solid
    ${props => (props.isLast ? "transparent" : hexToRgba("#979797", "0.4"))};
  width: 100%;
  display: flex;
  color: inherit;
  outline: none;
  vertical-align: middle;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
`;

const MainCol = styled.div`
  width: 66%;
  box-sizing: border-box;
  flex-grow: 1;
  padding: 0 10px;
  font-family: "Maven Pro", sans-serif;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  font-size: 12px;
  font-weight: 900;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, "0.7")};
  text-align: left;
  vertical-align: inherit;
`;

const IconBg = styled.button`
  border-radius: 50%;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  &:focus {
    outline: 0;
  }
`;

const BodyRow = styled.div`
  width: 100%;
  display: flex;
  color: inherit;
  outline: none;
  vertical-align: middle;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  margin-top: ${props => (props.isfirst ? "16px" : "0")};

  &:hover {
    background-color: ${props =>
      hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, "0.09")};
  }
`;

const LastCol = styled.div`
  padding-right: 5px;
  position: relative;
  width: 18%;
  box-sizing: border-box;
  flex-grow: 1;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, "1")};
  font-family: "Maven Pro", sans-serif;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  font-size: 12px;
  font-weight: 300;
  text-align: right;
  vertical-align: inherit;
`;

const BodyCol = styled.div`
  width: 16%;
  box-sizing: border-box;
  flex-grow: 1;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, "1")};
  font-family: "Maven Pro", sans-serif;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  font-size: 12px;
  font-weight: 300;
  text-align: right;
  vertical-align: inherit;
`;
