import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { PlusIcon, Minus } from "assets/icons";
import styled from "styled-components";

const RangeSlider = props => {
  let { config, width, onRangeSliderChange } = props;
  const [values, setValues] = useState([config.INITAL]);

  // On change handler
  let onChange = newValue => {
    if (newValue[0] !== values[0]) {
      setValues(newValue);
      // Callback on slider value change
      onRangeSliderChange && onRangeSliderChange(newValue);
    }
  };

  // Increase button click handler
  let handleIncrease = () => {
    let newValue = [Number(values) + props.config.STEP];
    if (newValue[0] <= props.config.MAX) {
      setValues(newValue);
      onRangeSliderChange && onRangeSliderChange(newValue);
    }
  };

  // Decrease button click handler
  let handleDecrease = () => {
    let newValue = [Number(values) - props.config.STEP];
    if (props.config.MIN <= newValue[0]) {
      setValues(newValue);
      onRangeSliderChange && onRangeSliderChange(newValue);
    }
  };

  return (
    <RangeContainer>
      <IconWrapper title="Zoom Out" onClick={handleDecrease}>
        <Minus />
      </IconWrapper>
      <RangeWrapper width={width}>
        <Range
          values={values}
          step={config.STEP}
          min={config.MIN}
          max={config.MAX}
          onChange={onChange}
          renderTrack={({ props, children }) => (
            <Track
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{ ...props.style }}
            >
              <TrackLine ref={props.ref} values={values} {...config}>
                {children}
              </TrackLine>
            </Track>
          )}
          renderThumb={({ props, isDragged }) => (
            <SlideThumb
              {...props}
              style={{
                ...props.style
              }}
            />
          )}
        />
      </RangeWrapper>
      <IconWrapper title="Zoom In" onClick={handleIncrease}>
        <PlusIcon />
      </IconWrapper>
    </RangeContainer>
  );
};

RangeSlider.defaultProps = {
  config: {
    INITAL: 40,
    STEP: 20,
    MIN: 0,
    MAX: 100
  },
  width: "97px"
};

const RangeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const RangeWrapper = styled.div`
  width: ${props => (props.width ? props.width : "auto")};
  margin: 0 15px;
`;

const Track = styled.div`
  height: 15px;
  display: flex;
  width: 100%;
`;

const SlideThumb = styled.div`
  ${props => `
    height: 16px;
    width: 16px;
    border-radius: 100%;
    background-color: ${props.theme.COLOR.BROWN_GREY};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 6px ${props.theme.COLOR.LIGHT_GREY};
    transition: transform 0.1s ease;
  `}
`;

const TrackLine = styled.div`
  ${props => `
    height: 3px;
    width: 100%;
    border-radius: 4px;
    background: ${getTrackBackground({
      values: props.values,
      colors: [
        props.theme.COLOR_PALLETE.BROWNISH_GREY,
        props.theme.COLOR_PALLETE.LIGHT_GREY
      ],
      min: props.MIN,
      max: props.MAX
    })};
    align-self: center;
  `}
`;

const IconWrapper = styled.span`
  cursor: pointer;

  svg {
    vertical-align: middle;
  }
`;

export default RangeSlider;
