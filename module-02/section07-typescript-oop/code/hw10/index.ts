function identity<T>(arg: T): T {
  return arg;
}

interface Box<T> {
  content: T;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(42));

const stringBox: Box<string> = { content: "TypeScript" };
const numberBox: Box<number> = { content: 100 };

console.log(stringBox);
console.log(numberBox);
