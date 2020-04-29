import React from "react";
import Container from "./container";
import { Redirect } from "react-router-dom";
import Loader from "components/loader";
import { includes, get } from "lodash";
import ToastUtils from "utils/handleToast";

const HomePage = props => {
  let roles = get(props, "userProfileMeta.roles") || [];
  let $isLoading = roles.length ? false : true;

  // Redirect to sales after login
  if (!$isLoading) {
    if (includes(roles, "Admin")) {
      return <Redirect to={"/renewal/admin"} />;
    } else if (includes(roles, "Underwriter")) {
      return <Redirect to={"/renewal/rates"} />;
    } else if (includes(roles, "Sales")) {
      return <Redirect to={"/renewal/renewals"} />;
    } else if (includes(roles, "PG-Users")) {
      return <Redirect to={"/presentation/list"} />;
    } else {
      //Show if user is created but no roles are assigned to user
      ToastUtils.handleToast({
        operation: "error",
        message: "No roles are assigned to the user."
      });
      return <Redirect to={"/logout"} />;
    }
  } else {
    return <Loader />;
  }
};

export default Container(HomePage);
