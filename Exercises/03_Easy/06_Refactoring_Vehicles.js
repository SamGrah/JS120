class Vehicle {
  constructor(make, model, wheels) {
    this.make = make;
    this.model = model;
    this.wheels = wheels;
  }

  getWheels() {
    return this.wheels;
  }

  info() {
    return `${this.make} ${this.model}`;
  }

}

class Car extends Vehicle {
  constructor(make, model) {
    super(make, model, 4);
  }
}

class Motorcycle extends Vehicle {
  constructor(make, model) {
    super(make, model, 4);
  }
}

class Truck extends Vehicle {
  constructor(make, model, payload) {
    super(make, model, 4);
    this.payload = payload;
  }
}

let bmw = new Car('BMW', 'M3');
console.log(bmw.getWheels());

let ducati = new Motorcycle('Ducati', 'gen1');
console.log(ducati.getWheels());

let pickup = new Truck('Ford', 'F-150', 2500);
console.log(pickup.payload);