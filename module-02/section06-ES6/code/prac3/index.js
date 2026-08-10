const userProfile = {
  username: "alice",
  age: 25,
  email: "alice@example.com",
  address: {
    city: "Hanoi",
  },
};

const { username: fullName, address: { city } } = userProfile;

console.log(fullName);
console.log(city);
