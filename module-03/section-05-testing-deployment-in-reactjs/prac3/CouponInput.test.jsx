import React from "react";
import { shallow } from "enzyme";
import CouponInput from "./CouponInput";

describe("CouponInput", () => {
  it("tự động chuyển thành chữ hoa khi nhập", () => {
    const wrapper = shallow(<CouponInput />);
    wrapper.find("input").simulate("change", { target: { value: "sale50" } });
    expect(wrapper.find("input").prop("value")).toEqual("SALE50");
  });
});
