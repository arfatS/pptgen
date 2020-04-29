import React from "react";
import { Route } from "react-router-dom";

import {
  AdminDashboard,
  Letters,
  Reports,
  Topics,
  Users
} from "tools/renewal/pages";

/**
 * Admin Route list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const adminRoutesComponent = (auth, checkAuthSession) => {
  const routes = (
    <>
      <Route
        exact
        path="/renewal/admin"
        render={props =>
          checkAuthSession(<AdminDashboard auth={auth} {...props} />)
        }
      />
      <Route
        exact
        path="/renewal/admin/letters"
        render={props => checkAuthSession(<Letters auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/renewal/admin/reports"
        render={props => checkAuthSession(<Reports auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/renewal/admin/topics"
        render={props => checkAuthSession(<Topics auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/renewal/admin/users"
        render={props => checkAuthSession(<Users auth={auth} {...props} />)}
      />
    </>
  );

  return routes;
};

export default adminRoutesComponent;
