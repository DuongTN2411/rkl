import React from "react";
import { shallow } from "enzyme";
import OrderStatus from "./OrderStatus";

describe("OrderStatus", () => {
  it("hiển thị nhãn Đã giao hàng", () => {
    const wrapper = shallow(<OrderStatus status="Delivered" />);
    expect(wrapper.find(".badge-success").text()).toEqual("Đã giao hàng");
  });
});
