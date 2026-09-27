function filterActiveUsers(users) {
  return users.filter((u) => u.isActive);
}

const users = [
  { id: 1, name: "Admin", isActive: true },
  { id: 2, name: "Bob", isActive: false },
  { id: 3, name: "Charlie", isActive: true },
];

describe("filterActiveUsers", () => {
  it("danh sách trả về chứa Admin (toContainEqual)", () => {
    const result = filterActiveUsers(users);
    expect(result).toContainEqual(expect.objectContaining({ name: "Admin" }));
  });

  it("danh sách trả về chứa Admin (vòng lặp + toEqual)", () => {
    const result = filterActiveUsers(users);
    const found = result.some((u) => u.name === "Admin");
    expect(found).toEqual(true);
  });
});
