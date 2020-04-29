import { createGlobalStyle } from "styled-components";
import hexToRgba from "utils/hexToRgba";

const GlobalStyle = createGlobalStyle`

  body {
    height: 100%;
    width: 100%;
    background: #f4f7fc;
  }

  div {
    box-sizing: border-box;
  }

  .fade-element {
    animation: fadeOut 2s linear 1 alternate both;
  }

  @keyframes fadeOut {
    from {
      background-color: ${hexToRgba("#b2e2ed", 0.29)};
    }
    to {
      background-color: transparent;
    }
  }

  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }

  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  
  .iosBody {
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .editor-custom-style {
  h1,
  h1 span {
    font-size: 32px !important;
  }
  h2,
  h2 span {
    font-size: 24px !important;
  }
  h3,
  h3 span {
    font-size: 20.8px !important;
  }
  h4,
  h4 span {
    font-size: 16px !important;
  }
  h5,
  h5 span {
    font-size: 12.8px !important;
  }
  h6,
  h6 span {
    font-size: 11.2px !important;
  }
  .DraftEditor-root {
    height: auto;
  }

  .rdw-right-aligned-block .public-DraftStyleDefault-ltr {
    text-align: right;
  }

  .rdw-center-aligned-block .public-DraftStyleDefault-ltr {
    text-align: center;
  }

  .rdw-justify-aligned-block .public-DraftStyleDefault-ltr {
    text-align: justify !important;
  }

  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    font-family: ${props => props.theme.FONT.LATO};
  }

  .editter-wrapper {
    border: 1px solid ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
    border-radius: 4px;
    box-sizing: border-box;
  }
  .rdw-editor-toolbar {
    box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.14);
  }
  .public-DraftStyleDefault-block {
    margin: 0;
  }

  .rdw-dropdown-optionwrapper {
    overflow-y: auto;
  }
  .rdw-fontsize-dropdown {
    min-width: 60px;
  }
  .rdw-editor-main {
    .DraftEditor-editorContainer {
      > div {
        overflow: auto;
        height: 200px;
        padding: 10px 10px 0;
        > div {
          padding-bottom: 15px;
        }
      }
    }

    .DraftEditor-root {
      height: auto;
    }
  }
  }
`;

export default GlobalStyle;
