class Owner {
  constructor(name) {
    this.name = name;
    this.pets = [];
  }

  getName() {
    return this.name;
  }

  getPets() {
    return this.pets;
  }

  adoptPet(pet) {
    this.pets.push(pet);
  }

  numberOfPets() {
    return this.pets.length;
  }
}

class Pet {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.name;
  }
}

class Shelter {
  constructor() {
    this.owners = [];
    this.petsInShelter = [];
  }

  addPetToShelter(pet) {
    this.petsInShelter.push(pet);
  }

  adopt(owner, pet) {
    owner.adoptPet(pet);
    if (!this.owners.includes(owner)) this.owners.push(owner);
    if (this.petsInShelter.includes(pet)) {
      let positionOfPet = this.petsInShelter.indexOf(pet);
      this.petsInShelter.splice(positionOfPet, 1);
    }
  }

  printAdoptions() {
    this.owners.forEach(owner => {
      console.log(`${owner.getName()} has adopted the following pets:`);

      owner.getPets().forEach(pet => {
        console.log(`a ${pet.getType()} named ${pet.getName()}`);
      });
      console.log('');
    });
  }

  printShelteredPetInfo() {
    console.log("The Animal Shelter has the following unadopted pets:");
    this.petsInShelter.forEach(pet => console.log(`a ${pet.getType()} named ${pet.getName()}`));
    console.log("");
  }

  printNumberOfShelteredPets() {
    console.log(`This sheler has ${this.petsInShelter.lenght} pets.`);
  }
}

let asta        = new Pet('Asta', 'dog');
let laddie      = new Pet('Laddie', 'dog');
let fluffy      = new Pet('Fluffy', 'cat');
let kat         = new Pet('Kat', 'cat');
let ben         = new Pet('Ben', 'cat');
let chatterbox  = new Pet('Chatterbox', 'parakeet');
let blueball    = new Pet('Bluebell', 'parakeet');

let butterscotch = new Pet('cat', 'Butterscotch');
let pudding      = new Pet('cat', 'Pudding');
let darwin       = new Pet('bearded dragon', 'Darwin');
let kennedy      = new Pet('dog', 'Kennedy');
let sweetie      = new Pet('parakeet', 'Sweetie Pie');
let molly        = new Pet('dog', 'Molly');
let chester      = new Pet('fish', 'Chester');

let phanson = new Owner('P Hanson');
let bholmes = new Owner('B Holmes');

let shelter = new Shelter();

shelter.adopt(phanson, butterscotch);
shelter.adopt(phanson, pudding);
shelter.adopt(phanson, darwin);
shelter.adopt(bholmes, kennedy);
shelter.adopt(bholmes, sweetie);
shelter.adopt(bholmes, molly);
shelter.adopt(bholmes, chester);

shelter.addPetToShelter(asta);
shelter.addPetToShelter(laddie);
shelter.addPetToShelter(fluffy);
shelter.addPetToShelter(kat);
shelter.addPetToShelter(ben);
shelter.addPetToShelter(chatterbox);
shelter.addPetToShelter(blueball);

shelter.printShelteredPetInfo();
shelter.printAdoptions();

console.log(`${phanson.name} has ${phanson.numberOfPets()} adopted pets.`);
console.log(`${bholmes.name} has ${bholmes.numberOfPets()} adopted pets.`);
shelter.printNumberOfShelteredPets();