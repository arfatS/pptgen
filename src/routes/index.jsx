import React from "react";
import { Router } from "react-router-dom";

import history from "../history";
import routes from "./routes";

const Routes = () => (
  <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
    {routes}
  </Router>
);

export default Routes;
