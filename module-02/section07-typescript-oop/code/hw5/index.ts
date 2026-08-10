class Employee {
  public name: string;
  private salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  printInfo(): void {
    console.log(`Name: ${this.name}, Salary: ${this.salary}`);
  }
}

const emp = new Employee("Bob", 5000);
emp.printInfo();
