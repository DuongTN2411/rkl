class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(): void {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
}

const dog = new Dog("Rex");
dog.makeSound();
