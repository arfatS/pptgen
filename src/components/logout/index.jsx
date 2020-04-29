import React from "react";
import Callback from "components/loader";

/**
 * Exit Tool on logout
 */
const Logout = props => {
  props.auth && props.auth.logout();
  return (
    <>
      <Callback />
    </>
  );
};

export default Logout;
