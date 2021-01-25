function objectsEqual(obj1, obj2) {
  if (!hasEqualProperties(obj1, obj2)) return false;
  if (!hasEqualProperties(obj2, obj1)) return false;

  function hasEqualProperties(obj1, obj2) {
    for (let prop in obj1) {
      if (obj2.hasOwnProperty(prop)) {
        if (obj1[prop] !== obj2[prop]) return false;
      } else {
        return false;
      }
    }
    return true;
  }
  return true;
}

console.log(objectsEqual({a: 'foo'}, {a: 'foo'}));                      // true
console.log(objectsEqual({a: 'foo', b: 'bar'}, {a: 'foo'}));            // false
console.log(objectsEqual({}, {}));                                      // true
console.log(objectsEqual({a: 'foo', b: undefined}, {a: 'foo', c: 1}));  // false