import React from "react";
import Presentation from "./presentation";
import Admin from "./admin";

/**
 * Presenation Routes list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const presentationRoutesComponent = (auth, checkAuthSession) => {
  const routes = (
    <>
      {Presentation(auth, checkAuthSession)}
      {Admin(auth, checkAuthSession)}
    </>
  );

  return routes;
};

export default presentationRoutesComponent;
