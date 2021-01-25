class Animal {
  constructor(name, gait) {
    this.name = name;
    this.gait = gait;
  }

  walk() {
    return `${this.name} ${this.gait} forward`;
  }
}

class Person extends Animal {
  constructor(name) {
    super(name, 'strolls');
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name, 'saunters');
  }
}

class Cheetah extends Animal {
  constructor(name) {
    super(name, 'runs');
  }
}


let mike = new Person("Mike");
console.log(mike.walk());
// "Mike strolls forward"

let kitty = new Cat("Kitty");
console.log(kitty.walk());
// "Kitty saunters forward"

let flash = new Cheetah("Flash");
console.log(flash.walk());
// "Flash runs forward"