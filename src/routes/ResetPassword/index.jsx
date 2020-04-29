import React from "react";
import { Route } from "react-router-dom";

// Components
import ResetPassowrd from "pages/password-reset";

/**
 * Auth Routes list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const ResetPassowrdRoutes = (auth, checkAuthSession) => {
  const routes = (
    <>
      <Route
        exact
        path="/password-reset"
        render={props => <ResetPassowrd {...props} />}
      />
    </>
  );

  return routes;
};

export default ResetPassowrdRoutes;
