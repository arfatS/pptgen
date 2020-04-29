import React, { Component } from "react";
import { each, includes } from "lodash";

const Container = Main =>
  class Lib extends Component {
    state = {
      expand: false,
      selectSlideCount: 0,
      groupObj: {}
    };

    selectedSlides = [];
    childrenList = [];

    componentDidMount() {
      let { groupObj } = this.state;
      let { handleDeckSlidesIds } = this.props;

      // set the deck slides id for bottom slider in overlay
      handleDeckSlidesIds(this.props.childList);
      this.childrenList = this.props.childList;

      each(this.childrenList, item => {
        if (item.group)
          groupObj[item.group.title] = groupObj[item.group.title]
            ? groupObj[item.group.title]
            : [];
        if (item.group && groupObj[item.group.title]) {
          groupObj[item.group.title].push(item._id);
        }
      });

      this.setState({
        groupObj
      });
    }

    /** Deck header checkbox handler*/
    handleParentCheckbox = e => {
      let { groupObj } = this.state;

      let countNum = this.props.selectSlides.length;
      let maxCount = this.props.maximumSlideCount;

      each(this.childrenList, item => {
        if (!includes(this.selectedSlides, item._id) && !item.group) {
          this.selectedSlides.push(item._id);
        } else {
          groupObj &&
            each(Object.keys(groupObj), item => {
              if (
                groupObj[item].length > 0 &&
                maxCount - countNum - this.selectedSlides.length >=
                  groupObj[item].length
              ) {
                this.selectedSlides = this.selectedSlides.concat(
                  groupObj[item]
                );
              }
            });
        }
      });

      if (e.target.checked) {
        this.props.handleSelectedSlides &&
          this.props.handleSelectedSlides(
            this.selectedSlides,
            true,
            "",
            this.childrenList
          );
      } else {
        this.props.handleSelectedSlides &&
          this.props.handleSelectedSlides(
            this.selectedSlides,
            false,
            "",
            this.childrenList
          );
        this.selectedSlides = [];
      }
    };

    /** Accordian handler*/
    handleExpandDeck = () => {
      let { expand } = this.state;
      this.setState({
        expand: !expand
      });
    };

    render() {
      const $this = this,
        { expand } = this.state;

      /**Merge State and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,

        expand
      };

      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
