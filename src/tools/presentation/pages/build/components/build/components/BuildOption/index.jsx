//Lib
import React from "react";

//Components
import RadioButton from "components/radioBtn";

/**
 * Component defined to Create Build Option
 * @param { This will accept two params such as value and Id of the Radio Button}
 */
export const BuildOption = props => {
  return (
    <RadioButton
      label={props.labelValue}
      id={props.idValue}
      defaultChecked={props.selected}
      handleChange={e => {
        props.changedValue(props.idValue);
      }}
    />
  );
};
