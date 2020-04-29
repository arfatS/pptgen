import React from "react";
import { Route } from "react-router-dom";

import { Build, Renewals } from "tools/renewal/pages";

/**
 * Renewal Route list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const renewalRoutesComponent = (auth, checkAuthSession) => {
  const routes = (
    <>
      <Route
        exact
        path="/renewal/renewals"
        render={props => checkAuthSession(<Renewals auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/renewal/build"
        render={props => checkAuthSession(<Build auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/renewal/edit/:id"
        render={props => checkAuthSession(<Build auth={auth} {...props} />)}
      />
    </>
  );

  return routes;
};

export default renewalRoutesComponent;
