import React, { Component } from "react";
import styled from "styled-components";

import { DraggableContainerComponent } from "./components/draggableContainer";
class SlideComponent extends Component {
  render() {
    return (
      <PreviewContainer>
        <PreviewSlideContainer>
          <DraggableContainerComponent {...this.props} />
        </PreviewSlideContainer>
      </PreviewContainer>
    );
  }
}

const PreviewContainer = styled.div`
  height: 100%;
`;

const PreviewSlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;

export default SlideComponent;
