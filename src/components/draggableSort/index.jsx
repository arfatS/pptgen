import React, { Component } from "react";
import styled from "styled-components";
import container from "./container";
import { map } from "lodash";

class DraggableSort extends Component {
  render() {
    let { style, _renderChildren, listData } = this.props;
    return (
      <ListGridWrapper style={style}>
        {/* map the list data and create child */}
        {map(listData, (eachData, index) => _renderChildren(eachData, index))}
      </ListGridWrapper>
    );
  }
}
export default container(DraggableSort);

const ListGridWrapper = styled.div``;
