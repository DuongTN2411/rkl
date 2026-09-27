import React from "react";
import { shallow } from "enzyme";
import Dashboard from "./Dashboard";

describe("Dashboard - shallow", () => {
  it("hiển thị thẻ h1 Title", () => {
    const wrapper = shallow(<Dashboard />);
    expect(wrapper.find("h1").text()).toEqual("Title");
  });
});
