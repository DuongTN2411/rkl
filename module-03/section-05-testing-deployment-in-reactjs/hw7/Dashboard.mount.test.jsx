import React from "react";
import { mount } from "enzyme";
import Dashboard from "./Dashboard";

describe("Dashboard - mount", () => {
  it("hiển thị thẻ h1 Title", () => {
    const wrapper = mount(<Dashboard />);
    expect(wrapper.find("h1").text()).toEqual("Title");
  });
});
