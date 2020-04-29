import React from "react";
import { Route } from "react-router-dom";

// App Components
import Home from "pages/home";
import LandingPage from "pages/landingPage";
import LogOut from "components/logout";

// Auth0 handler component
import Callback from "components/loader";
import profileContextWrapper from "utils/profileContextWrapper";

// handle auth0 authentication
const handleAuthentication = (auth, { location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

/**
 * Auth Routes list
 * @param {Object} auth
 * @param {Object} history
 * @param {Function} checkAuthSession
 */
const authRoutesComponent = (auth, history, checkAuthSession) => {
  const routes = (
    <>
      <Route
        path="/login"
        render={props => <LandingPage auth={auth} {...props} />}
      />
      <Route
        exact
        path="/home"
        render={props =>
          checkAuthSession(profileContextWrapper(Home, auth, props))
        }
      />

      <Route
        exact
        path="/callback"
        render={props => {
          handleAuthentication(auth, props);
          return <Callback auth={auth} {...props} />;
        }}
      />

      <Route
        exact
        path="/logout"
        render={props => <LogOut history={history} auth={auth} {...props} />}
      />
    </>
  );

  return routes;
};

export default authRoutesComponent;
