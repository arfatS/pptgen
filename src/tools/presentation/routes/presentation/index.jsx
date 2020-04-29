import React from "react";
import { Route } from "react-router-dom";

import { Build, Dashboard } from "tools/presentation/pages";
import profileContextWrapper from "utils/profileContextWrapper";

/**
 * Presentation Route list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const presentationRoutesComponent = (auth, checkAuthSession) => {
  const routes = (
    <>
      <Route
        exact
        path="/presentation/build"
        render={props =>
          checkAuthSession(profileContextWrapper(Build, auth, props))
        }
      />
      <Route
        exact
        path="/presentation/build/:id"
        render={props =>
          checkAuthSession(profileContextWrapper(Build, auth, props))
        }
      />
      <Route
        exact
        path="/presentation/list"
        render={props =>
          checkAuthSession(profileContextWrapper(Dashboard, auth, props))
        }
      />
    </>
  );

  return routes;
};

export default presentationRoutesComponent;
