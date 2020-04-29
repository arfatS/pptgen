import React from "react";
import { shallow } from "enzyme";
import App from "pages/app";
import "enzymeAdapter";
import Auth0Test from "__mocks__services/auth0Test.js";

describe("App: Fetch Auth0 token and check if component is rendered correctly", () => {
  const auth = {
    renewSession: () => {}
  };

  it("App: should load user data with auth0 token", async () => {
    const response = await Auth0Test();

    expect(typeof response === "object").toBe(true);
    expect(response.access_token).toBeDefined();

    // authenticate auth0
    auth.isAuthenticated = () => {
      return response.access_token ? true : false;
    };
  });

  it("App: component renders correctly with props", () => {
    const Component = shallow(<App auth={auth} />);
    expect(Component).toMatchSnapshot();
  });
});
