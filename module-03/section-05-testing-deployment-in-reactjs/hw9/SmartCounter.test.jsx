import React from "react";
import { shallow } from "enzyme";
import SmartCounter from "./SmartCounter";

describe("SmartCounter", () => {
  it("hiển thị ban đầu là 0", () => {
    const wrapper = shallow(<SmartCounter />);
    expect(wrapper.find("#count").text()).toEqual("0");
  });

  it("bấm Tăng lên 1", () => {
    const wrapper = shallow(<SmartCounter />);
    wrapper.find("button").at(0).simulate("click");
    expect(wrapper.find("#count").text()).toEqual("1");
  });

  it("bấm Giảm không được phép âm", () => {
    const wrapper = shallow(<SmartCounter />);
    wrapper.find("button").at(1).simulate("click");
    expect(wrapper.find("#count").text()).toEqual("0");
  });
});
