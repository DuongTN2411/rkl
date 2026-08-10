class Car {
  brand: string;
  year: number;

  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }

  getDetails(): void {
    console.log(`Brand: ${this.brand}, Year: ${this.year}`);
  }
}

const car = new Car("Toyota", 2022);
car.getDetails();
