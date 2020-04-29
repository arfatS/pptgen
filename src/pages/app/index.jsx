import React, { Component } from "react";
import renewAuthSession from "AuthLogin/renewAuthSession";
import Header from "components/header";
import { getProfileDetail } from "./services/getUserDetail";
import Loader from "components/loader";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import checkUserPermission from "utils/checkUserPermission";

class App extends Component {
  checkAndRenewSession = () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      renewAuthSession(this.props.auth);
    }
  };

  componentDidUpdate() {
    const { userProfileMeta: profile, history } = this.props;
    checkUserPermission({
      location: history.location,
      profile
    });
  }

  componentDidMount() {
    const { pathname } = this.props.history.location;
    // set initial session on app mount
    this.checkAndRenewSession();

    //check if token is present to get profile data
    if (localStorage.getItem("token")) {
      this.props.getProfileDetail();
    }

    // check if login route is hit directly and check whether user is already logged in
    if (
      localStorage.getItem("isLoggedIn") === "true" &&
      localStorage.getItem("token") &&
      ["/", "/login"].indexOf(pathname) !== -1
    ) {
      //remove email if exists
      localStorage.removeItem("password-reset-email");
      this.props.history.push("/home");
    }
  }

  render() {
    //check if reset password route is active
    let checkIfUserLoggedIn =
      localStorage.getItem("isLoggedIn") && localStorage.getItem("token");
    let { pathname } = this.props.history.location;
    let resetPasswordRouteActive =
      !!!checkIfUserLoggedIn && pathname === "/password-reset";

    if (this.props.isProfileLoading) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
    }

    if (
      (checkIfUserLoggedIn &&
        this.props.history.location.pathname !== "/logout") ||
      resetPasswordRouteActive
    ) {
      return (
        <>
          <Header
            {...this.props}
            resetPasswordRouteActive={resetPasswordRouteActive}
          />
          <ToastContainerStyled />
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => {
  const { SUCCESS_USER_PROFILE, LOADING_USER_PROFILE } = state;
  return {
    ...SUCCESS_USER_PROFILE,
    ...LOADING_USER_PROFILE
  };
};

export default connect(
  mapStateToProps,
  {
    getProfileDetail
  }
)(App);

const LoaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: ${props => props.theme.COLOR.CONTAINER};
  z-index: 30;
`;

const ToastContainerStyled = styled(ToastContainer)`
  .Toastify__toast {
    display: block;
    position: relative;
    padding: 15px;
    min-height: 50px;
    border-radius: 3px;
  }

  .Toastify__close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
  }
`;
