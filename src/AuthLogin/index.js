import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-config";
import history from "../history";
import { get } from "lodash";

export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  tokenRenewalTimeout;
  auth0;

  constructor(ORIGIN) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.origin = ORIGIN;
    this.scheduleRenewal();

    this.auth0 = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientID,
      redirectUri: `${ORIGIN}/callback`,
      audience: AUTH_CONFIG.audience,
      responseType: "token id_token",
      scope: "openid email"
    });
  }

  login() {
    //remove email id from storage
    localStorage.removeItem("password-reset-email");
    this.auth0.authorize();
  }

  // scheduler to renew token
  scheduleRenewal = () => {
    let expiresAt = this.expiresAt;
    const timeout = expiresAt - new Date().getSeconds();

    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout * 1000);
    }
  };

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        // navigate to the home route
        history.replace("/");
      } else if (err) {
        //set flag if user is unauthorized
        if (err.error === "unauthorized") {
          localStorage.setItem("unauthorized", true);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("idToken");

        // check and redirect if user has last reset password flag active set by auth0 rule.
        this.handleResetLastPassword(err);

        console.log(`Error: ${err.error}.`);
        console.log(err);
      }
    });
  }

  /**
   * Handle Reset Last Password - Will be executed when auth0 rule fails to check if user has its last password reset flag active
   *
   * @memberof Auth
   * @param {Object} err - err object described with type and description
   */
  handleResetLastPassword = err => {
    //extract password reset flag with email
    // Handle Last password reset for user
    let errMsgWithEmail = (get(err, "errorDescription") || "").split("?") || [];
    let checkIfUserHasPasswordReset =
      errMsgWithEmail[0] === "password_reset_required";

    if (checkIfUserHasPasswordReset && errMsgWithEmail[1]) {
      let email = errMsgWithEmail[1];

      //set reset password flag
      localStorage.setItem("password-reset-email", email);

      // logout with new user route
      let returnTo = `${this.origin}/password-reset`;
      this.auth0.logout({
        returnTo
      });
    } else {
      history.replace("/login");
    }
  };

  //remove unauthorized flag for user.
  resetUserFlag = () => {
    localStorage.removeItem("unauthorized");
    window.setTimeout(() => this.logout(), 1000);
  };

  getAccessToken() {
    return localStorage.getItem("token");
  }

  getIdToken() {
    return localStorage.getItem("idToken");
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");

    // Set the time that the access token will expire at
    let expiresAt = authResult.expiresIn + new Date().getSeconds();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // set id token in local storage
    localStorage.setItem("token", this.accessToken);
    localStorage.setItem("idToken", this.idToken);

    // schedule a token renewal
    this.scheduleRenewal();
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("idToken");
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("idToken");
    localStorage.removeItem("password-reset-email");

    let returnTo = this.origin + "/login";
    this.auth0.logout({
      returnTo
    });

    // clear timeout
    clearTimeout(this.tokenRenewalTimeout);
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getSeconds() < expiresAt;
  }
}
