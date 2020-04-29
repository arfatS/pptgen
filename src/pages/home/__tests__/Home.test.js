import React from "react";
import { shallow } from "enzyme";
import Home from "pages/home";
import "enzymeAdapter";

it("Home: component renders correctly", () => {
  const Component = shallow(<Home />);
  expect(Component).toMatchSnapshot();
});
