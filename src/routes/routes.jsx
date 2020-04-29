import React from "react";
import { Route, Redirect } from "react-router-dom";

import Auth from "AuthLogin";

import App from "pages/app";
import history from "../history";
import profileContextWrapper from "utils/profileContextWrapper";

// Authentication routes
import AuthRoutes from "./Auth";

// Reset Password
import ResetPassword from "./ResetPassword";

// Renewal routes
import RenewalRoutes from "tools/renewal/routes";

// Presentation routes
import PresentationRoutes from "tools/presentation/routes";

// initiate Auth0 instance
const auth = new Auth(window.location.origin);

// check auth session and redirect if not authenticated
const checkAuthSession = (Component, props) => {
  let checkIfUserLoggedIn =
    localStorage.getItem("isLoggedIn") && localStorage.getItem("token");

  //check if reset password route is active
  if (props) {
    let { pathname } = props.history.location;
    if (!checkIfUserLoggedIn && pathname === "/password-reset")
      return Component;
  }

  return checkIfUserLoggedIn ? Component : <Redirect to="/login" />;
};

// merge all routes in allRoutesList array
const allRoutesList = auth => [
  AuthRoutes(auth, history, checkAuthSession),
  ResetPassword(auth, checkAuthSession),
  PresentationRoutes(auth, checkAuthSession),
  RenewalRoutes(auth, checkAuthSession)
];

// App route components
const routes = (
  <>
    <Route
      path="/"
      render={props =>
        checkAuthSession(profileContextWrapper(App, auth, props), props)
      }
    />
    {allRoutesList(auth)}
  </>
);

export default routes;
