import React, { Component } from "react";

import AccordionContent from "./components/AccordionContent";

class Accordion extends Component {
  constructor(props) {
    super(props);

    const activeSection = {};

    //check the label of the active Accordion
    this.props.children.forEach(child => {
      if (child.props.isOpen) {
        activeSection[child.props.label] = true;
      }
    });

    //set state based on the label with true value
    this.state = { activeSection };
  }

  /**
   * This will accept the label value whose value will be of type string.
   * This functions handle the state of the accordion based on the active or not.
   */
  accordionHandler = label => {
    this.setState({
      activeSection: {
        [label]: !this.state.activeSection[label]
      }
    });
  };

  //TODO: This Is currently common for edit and delete icon. This will be changed during API Integration

  onEditHandler = e => {
    e.stopPropagation();
  };

  render() {
    return (
      <div>
        {//This will map through the number of accordion required and create the structure accordingly
        this.props.children.map((child, index) => {
          let chidlPropsValue = child.props;
          return (
            <AccordionContent
              key={child.key}
              canEdit={chidlPropsValue.canEdit}
              canDelete={chidlPropsValue.canDelete}
              header={chidlPropsValue.header}
              accordionHandler={this.accordionHandler}
              isActive={this.state.activeSection[chidlPropsValue.label]}
              label={chidlPropsValue.label}
              requiresScrollbar={chidlPropsValue.requiresScrollbar}
              editHandler={this.onEditHandler}
            >
              {child.props.children}
            </AccordionContent>
          );
        })}
      </div>
    );
  }
}

export default Accordion;
