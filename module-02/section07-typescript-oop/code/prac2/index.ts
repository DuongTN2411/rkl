interface User {
  id: number;
  name: string;
  email: string;
}

const newUser: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

console.log(newUser);
