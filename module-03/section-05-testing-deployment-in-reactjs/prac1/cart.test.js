function calculateCart(items) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return { total, items: items.length };
}

describe("Cart Logic", () => {
  it("trả về đối tượng giỏ hàng chuẩn xác", () => {
    const result = calculateCart([{ price: 100 }, { price: 200 }]);
    expect(result).toEqual({ total: 300, items: 2 });
  });
});
