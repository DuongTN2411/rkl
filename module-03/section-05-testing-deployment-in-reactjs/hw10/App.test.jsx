import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App", () => {
  it("hiển thị tiêu đề Danh bạ nhân viên", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("h1").text()).toEqual("Danh bạ nhân viên");
  });
});
