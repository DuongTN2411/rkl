import React from "react";
import { mount } from "enzyme";
import WeatherWidget from "./WeatherWidget";

describe("WeatherWidget", () => {
  it("hiển thị dữ liệu thời tiết mà không gọi API thật", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({ description: "Nắng đẹp" }),
    });

    const wrapper = mount(<WeatherWidget />);
    await new Promise((r) => setTimeout(r, 0));
    wrapper.update();

    expect(wrapper.text()).toContain("Nắng đẹp");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    global.fetch.mockRestore();
  });
});
