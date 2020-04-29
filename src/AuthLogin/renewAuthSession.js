/**
 * Renew is session is expired
 * @param {Objec} auth 
 */
const renewAuthSession = (auth) => {
  // renew session if expired
  const {
    isAuthenticated,
    renewSession
  } = auth;

  if (!isAuthenticated() && localStorage.getItem("isLoggedIn") === "true") {
    renewSession();
  }
}

export default renewAuthSession;