// name property added to make objects easier to identify
// eslint-disable-next-line no-extend-native
Object.prototype.ancestors = function() {
  let prototypes = [];
  let currentObj = this;
  while (true) {
    currentObj = Object.getPrototypeOf(currentObj);
    if (currentObj === Object.prototype) {
      prototypes.push('Object.prototype');
      break;
    }
    prototypes.push(currentObj.name);
  }
  return prototypes;
};

let foo = {name: 'foo'};
let bar = Object.create(foo);
bar.name = 'bar';
let baz = Object.create(bar);
baz.name = 'baz';
let qux = Object.create(baz);
qux.name = 'qux';

console.log(qux.ancestors());  // returns ['baz', 'bar', 'foo', 'Object.prototype']
console.log(baz.ancestors());  // returns ['bar', 'foo', 'Object.prototype']
console.log(bar.ancestors());  // returns ['foo', 'Object.prototype']
console.log(foo.ancestors());  // returns ['Object.prototype']