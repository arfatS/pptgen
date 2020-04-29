import React from "react";
import { shallow } from "enzyme";
import Build from "../index";
import "enzymeAdapter";

describe("Build: Process to create a renewal", () => {
  it("Build: component renders correctly", () => {
    const Component = shallow(<Build />);
    expect(Component).toMatchSnapshot();
  });
});
