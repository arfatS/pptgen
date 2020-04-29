import React from "react";
import Rates from "./rates";
import Admin from "./admin";
import Renewals from "./renewals";

/**
 * Renewal Routes list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const renewalRoutesComponent = (auth, checkAuthSession) => {
  const routes = (
    <>
      {Rates(auth, checkAuthSession)}
      {Admin(auth, checkAuthSession)}
      {Renewals(auth, checkAuthSession)}
    </>
  );

  return routes;
};

export default renewalRoutesComponent;
