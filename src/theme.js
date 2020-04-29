import hexToRgba from "./utils/hexToRgba";
import { css } from "styled-components";

const theme = {
  COLOR: {
    HEADING: "#363636",
    MAIN: "#636363",
    SECONDARY: "#8b8b8b",
    USER_PRIMARY: "#215eff",
    PRIMARY_LIGHT: hexToRgba("#215eff", 0.62),
    LIGHT_GREY: "rgba(216, 216, 216, 0.56)",
    FADED_GREY: "rgba(216, 216, 216, 0.4)",
    CONTAINER: "#f4f7fc",
    WHITE: "#fff",
    BLACK: "#111",
    BACKGROUND_COLOR: "#e6e6e6",
    BROWN_GREY: "#808080",
    INPUT: "#d6d6d62e",
    ERROR: "#ff4d4d",
    MODAL_FADED_GREY: "rgba(109, 109, 109, .4)",
    SCROLL_SHADOW: "rgba(255, 255, 255, 0)",
    OFF_WHITE: "#fffcfc",
    LIGHT_BLUE: "rgba(65, 171, 193, 0.09)",
    LIGHT_GREYISH: "rgba(99, 99, 99, 0.64)",
    INPUT_FOCUS: "#2684ff",
    BORDER_GREY: "#d1d1d1"
  },
  COLOR_PALLETE: {
    BROWNISH_GREY: "#636363",
    GREY: "#363636",
    LIGHT_GREY: "#979797",
    DARK_GREY: "#8b8b8b",
    COOL_BLUE: "#41abc1",
    ARMY_GREY: "#d8d8d8",
    APPLE_GREEN: "#7cc522",
    GOLDEN: "#f3c200",
    SOLITUDE: "#e2e4e6",
    LIPSTICK: "#df1829",
    ERROR: "#e74c3c",
    HIGHLIGHT_SELECTED: "#ccc",
    HIGHLIGHT_HOVER: "#efefef",
    DROPDOWN_HOVER: "#ddd",
    ACCORDION_ACTIVE: "#eef7f9"
  },
  SIZE: {
    MAIN: "14px",
    SECONDARY: "14px"
  },
  FONT: {
    REG: "'Maven Pro', sans-serif",
    LATO: "'Lato', sans-serif",
    HEEBO: "'Heebo', sans-serif"
  },
  WRAPPER: {
    WIDTH: "95%",
    MAX_WIDTH: "1250px",
    COLOR: "#f4f7fc",
    STEPPER_COLOR: "#636363"
  },
  SNIPPETS: {
    FONT_STYLE: css`
      font-family: "Maven Pro", sans-serif;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
    `,
    BOX_SHADOW: css`
      box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
    `,
    BOX_SHADOW_DARK: css`
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    `,

    BOX_SHADOW_PRESENTATION: css`
      box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);
    `,

    SHARED_BUTTON_CSS: css`
      width: calc(50% - 3px);
      height: 40px;
      border-radius: 4px;
      border: none;
      outline: none;
      cursor: pointer;
      font-family: ${props => props.theme.FONT.REG};
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease-in-out;
    `,
    SHARED_INPUT_STYLE: css`
      display: block;
      box-sizing: border-box;
      width: 100%;
      margin-top: 3px;
      padding: 10px 8px;
      color: #636363;
      font-family: "Lato", sans-serif;
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      text-transform: capitalize;
      border-radius: 4px;
      border: solid 1px rgba(151, 151, 151, 0.4);
      background: #d6d6d62e;
      outline: none;
    `,
    SHARED_BUTTON_STYLE: css`
      width: 113px;
      height: 40px;
      border: none;
      border-radius: 4px;
      outline: none;
      transition: all 0.5s ease 0s;
      font-weight: bold;
      font-size: 14px;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      cursor: pointer;
      font-family: ${props => props.theme.FONT.REG};
      color: #fff;
      vertical-align: top;
    `,
    HELPER_TEXT: css`
      font-family: ${props => props.theme.FONT.LATO};
      font-size: 12px;
      font-weight: 300;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: ${props => props.theme.COLOR_PALLETE.GREY};
      opacity: 0.67;
      margin-bottom: 15px;
    `
  }
};

export default function configureTheme() {
  return theme;
}
