/**
 *Fuction to handle body scrollbar when modal is opened/close
 *
 * @param {String} { action } hide/show scroll bar
 *
 */
const handleBodyScroll = ({ action }) => {
  const body = document.querySelector("body");
  const html = document.querySelector("html");
  if (action === "open") {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      body.classList.add("iosBody");
      html.classList.add("iosBody");
    }

    const scrollWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style = `overflow: hidden; height: 100vh; position: relative; margin-right: ${scrollWidth}px;`;
  } else if (action === "close") {
    document.body.style = `overflow: auto; height: auto; position: static; margin-right: ${0}`;
    body.style.overflow = "auto";

    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      body.classList.remove("iosBody");
      html.classList.remove("iosBody");
    }
  } else {
    return window.innerWidth - document.documentElement.clientWidth;
  }
};

export default handleBodyScroll;
