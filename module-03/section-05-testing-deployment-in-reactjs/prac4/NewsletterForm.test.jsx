import React from "react";
import { mount } from "enzyme";
import NewsletterForm from "./NewsletterForm";

describe("NewsletterForm", () => {
  it("gọi onSubmit khi bấm nút đăng ký", () => {
    const mockSubmit = jest.fn();
    const wrapper = mount(<NewsletterForm onSubmit={mockSubmit} />);
    wrapper.find("form").simulate("submit");
    expect(mockSubmit).toHaveBeenCalled();
  });
});
