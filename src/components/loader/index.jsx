import React from "react";
import styled from "styled-components";

// First way to import
import { PacmanLoader, BounceLoader } from "react-spinners";

class AwesomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    // loader based on env
    const LoaderComponent = process.env.REACT_APP_LOADER
      ? PacmanLoader
      : BounceLoader;

    return (
      <LoaderContainer className="sweet-loading">
        <LoaderComponent
          sizeUnit={"px"}
          size={this.props.size}
          margin={"2px"}
          color={"#123abc"}
          isPacman={process.env.REACT_APP_LOADER}
          loading={this.state.loading}
        />
      </LoaderContainer>
    );
  }
}

AwesomeComponent.defaultProps = {
  size: 50
};

const LoaderContainer = styled.div`
  position: fixed;
  z-index: 10;
  top: calc(50% - 50px);
  left: ${props => (props.isPacman ? `calc(50% - 50px)` : `calc(50%)`)};
  transform: translate(-50%, -50%);
`;

export default AwesomeComponent;
