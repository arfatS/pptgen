import APIUtils from "./apiUtils";

const url = `https://${process.env.REACT_APP_AUTH_DOMAIN}/oauth/token`;
const body = {
  grant_type: "password",
  username: process.env.REACT_APP_AUTH_TEST_EMAIL,
  password: process.env.REACT_APP_AUTH_TEST_PASSWORD,
  audience: process.env.REACT_APP_AUTH_AUDIENCE,
  scope: "openid",
  client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
  client_secret: process.env.REACT_APP_AUTH_CLIENT_SECRET
};

const headers = {
  "content-type": "application/x-www-form-urlencoded"
};

export default APIUtils.postData.bind(null, url, body, headers);
