import css from "dom-css";
import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

class ShadowScrollbars extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this._scrollToTop();
  }

  _scrollToTop() {
    const { scrollbars } = this.refs;
    if (this.props.scrollcontenttotop) {
      scrollbars.scrollToTop(0);
    }
  }

  handleUpdate(values) {
    const { shadowTop, shadowBottom } = this.refs;
    const { scrollTop, scrollHeight, clientHeight } = values;
    const shadowTopOpacity = (1 / 20) * Math.min(scrollTop, 20);
    const bottomScrollTop = scrollHeight - clientHeight;
    const shadowBottomOpacity =
      (1 / 20) * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
    css(shadowTop, { opacity: shadowTopOpacity });
    css(shadowBottom, {
      opacity: shadowBottomOpacity
    });
  }

  render() {
    const { style, ...props } = this.props;

    const containerStyle = {
      ...style,
      position: "relative"
    };

    return (
      <div className="slide-scrollbar" style={containerStyle}>
        <Scrollbars ref="scrollbars" onUpdate={this.handleUpdate} {...props} />
        <div className="shadow shadowTop" ref="shadowTop" style={null} />
        <div className="shadow shadowBottom" ref="shadowBottom" style={null} />
      </div>
    );
  }
}

export default ShadowScrollbars;
