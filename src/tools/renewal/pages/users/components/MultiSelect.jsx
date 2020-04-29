import React from "react";
import { default as ReactSelect } from "react-select";

const MultiSelect = props => {
  if (props.allowSelectAll) {
    return (
      <ReactSelect
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={selected => {
          if (
            selected !== null &&
            selected.length > 0 &&
            selected[selected.length - 1].value === props.allOption.value
          ) {
            return props.onChange(props.options);
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <ReactSelect {...props} />;
};

MultiSelect.defaultProps = {
  allOption: {
    state: "Select all",
    value: "*"
  }
};

export default MultiSelect;
