import React from "react";

//components
import MainSection from "../MainSection";

const SlideLayout = ({ data, isCover, noteText }) => (
  <MainSection data={data} isCover={isCover} noteText={noteText} />
);

SlideLayout.defaultProps = {
  data: [],
  isCover: false,
  noteText: ""
};

export default SlideLayout;
