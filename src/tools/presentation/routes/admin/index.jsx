import React from "react";
import { Route } from "react-router-dom";

import ContentRepo from "tools/presentation/pages/contentRepo";
import Setup from "tools/presentation/pages/admin/setup";
import Admin from "tools/presentation/pages/admin/layouts";

import Interactivity from "tools/presentation/pages/Interactivity";
import Theme from "tools/presentation/pages/themes";

/**
 * Admin Routes list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const adminRoutes = (auth, checkAuthSession) => {
  const routes = (
    <>
      <Route
        exact
        path="/presentation/admin/repositories"
        render={props =>
          checkAuthSession(<ContentRepo auth={auth} {...props} />)
        }
      />
      <Route
        exact
        path="/presentation/admin/setup"
        render={props => checkAuthSession(<Setup auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/presentation/admin/content-repo/layouts"
        render={props => checkAuthSession(<Admin auth={auth} {...props} />)}
      />
      <Route
        exact
        path="/presentation/admin/content-repo/interactivity"
        render={props =>
          checkAuthSession(<Interactivity auth={auth} {...props} />)
        }
      />
      <Route
        exact
        path="/presentation/admin/content-repo/themes"
        render={props => checkAuthSession(<Theme auth={auth} {...props} />)}
      />
    </>
  );
  return routes;
};

export default adminRoutes;
