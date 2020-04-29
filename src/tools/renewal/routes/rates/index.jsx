import React from "react";
import { Route } from "react-router-dom";

import { Rates, RatesUpload } from "tools/renewal/pages";

/**
 * Rates Route list
 * @param {Object} auth
 * @param {Function} checkAuthSession
 */
const ratesRoutesComponent = (auth, checkAuthSession) => {
  const routes = (
    <>
      <Route
        exact
        path="/renewal/rates/upload"
        render={props =>
          checkAuthSession(<RatesUpload auth={auth} {...props} />)
        }
      />
      <Route
        exact
        path="/renewal/rate/update/:id"
        render={props =>
          checkAuthSession(
            <RatesUpload rateUpdate={true} auth={auth} {...props} />
          )
        }
      />
      <Route
        exact
        path="/renewal/rates"
        render={props => checkAuthSession(<Rates auth={auth} {...props} />)}
      />
    </>
  );

  return routes;
};

export default ratesRoutesComponent;
