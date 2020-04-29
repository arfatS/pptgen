import React, { Component } from "react";
import container from "./container";
import styled from "styled-components";
import Button from "../button";
import hexToRgba from "utils/hexToRgba";
import ReactDragList from "react-drag-list";
import { MoveDouble } from "assets/icons";

import "react-drag-list/assets/index.css";

class SearchPriorities extends Component {
  static defaultProps = {
    searchOptions: ["Title", "Body", "Speaker Notes", "Meta Description"]
  };

  render() {
    let { searchOptions } = this.props;
    return (
      <Wrapper>
        <Float>
          <HeadingContainer>
            <Heading>Search Priorities</Heading>
            <SubHeading>
              Drag to re-arrange search priorities accordingly.
            </SubHeading>
          </HeadingContainer>
          <FloatRight>
            <ButtonWrapper>
              <Button text="Reset" width={80} isFixed={true} type="secondary" />
            </ButtonWrapper>
            <Button text="Save" width={80} isFixed={true} type="primary" />
          </FloatRight>
        </Float>
        <DragList>
          <NumCol>
            {searchOptions.map((ele, index) => (
              <NumRow>{index + 1}</NumRow>
            ))}
          </NumCol>
          <ReactDragList
            dataSource={searchOptions}
            row={(record, index) => (
              <Row key={index}>
                <DragIcon />
                <Text>{record}</Text>
              </Row>
            )}
            handles={false}
            rowClassName="search-tab"
            style={{
              display: "inline-block",
              maxWidth: "230px",
              width: "50%"
            }}
          />
        </DragList>
      </Wrapper>
    );
  }
}
export default container(SearchPriorities);

const Wrapper = styled.div`
  width: 100%;
  padding: 28px 40px;
  border-radius: 4px;
  background-color: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;

  .search-tab {
    margin-bottom: 14px;
  }

  .rc-draggable-list {
    cursor: move;
  }
`;

const DragIcon = styled(MoveDouble)`
  display: block;
  position: absolute;
  left: 10px;
  top: 14px;
`;

const Heading = styled.h2`
  display: inline-block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  text-align: left;
`;

const SubHeading = styled.span`
  margin-top: 2px;
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
`;

const Row = styled.div`
  width: 230px;
  position: relative;
  padding: 8px 0 9px 35px;
  display: inline-block;
  box-sizing: border-box;
  background-color: ${props =>
    hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
  border-radius: 2px;
`;

const DragList = styled.div``;

const NumCol = styled.ul`
  width: 18px;
  display: inline-block;
  vertical-align: top;
`;

const NumRow = styled.li`
  padding: 10px 0 9px;
  margin-bottom: 14px;
  text-align: left;
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  font-size: 12px;
  font-weight: bold;
  box-sizing: border-box;
`;

const Text = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
`;

const Float = styled.div`
  width: 100%;
  margin-bottom: 30px;

  &:after {
    content: "";
    clear: both;
    display: table;
  }
`;

const FloatRight = styled.div`
  float: right;
`;
const HeadingContainer = styled.div`
  float: left;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  margin-right: 15px;
`;
