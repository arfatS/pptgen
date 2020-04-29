import React, { Component } from "react";
const Container = Main =>
  class Build extends Component {
    static defaultProps = {
      useremail: "abe@qbe.com",
      progressBarWidth: 100,
      showBuildProgress: false,
      status: "success"
    };

    state = {
      messages: {
        completed: `Renewal was successfully build.`,
        failed: "There was an error in the build process. Please try again.",
        interrupt: "Your file didn’t meet the minimum resolution requirements."
      }
    };

    componentDidMount() {
      this.props.resetProgressBar();
    }

    componentDidUpdate(prevProps) {
      if (
        !prevProps.showBuildProgress &&
        this.props.showBuildProgress &&
        prevProps.showBuildProgress !== this.props.showBuildProgress
      ) {
        this.scrollToBottom();
      }
    }

    scrollToBottom = () => {
      window.scrollTo(0, document.body.scrollHeight);
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,
        ...JSON.parse(JSON.stringify($this.state))
      };
      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
