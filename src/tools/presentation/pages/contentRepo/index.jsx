import React from "react";
import Container from "./container";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./components/landingPage";

const ContentRepoLanding = props => {
  return (
    <>
      <LandingPage {...props} />
    </>
  );
};

export default Container(ContentRepoLanding);
