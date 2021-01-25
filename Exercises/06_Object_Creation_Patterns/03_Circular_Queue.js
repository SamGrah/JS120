class CircularQueue {
  constructor(queueSize) {
    this.queue = (new Array(queueSize)).fill(null);
    this.indexOrder = [];
  }

  enqueue(obj) {
    if (this.queue.every(spot => spot !== null)) this.dequeue();
    let indexToInsert = this.queue.indexOf(null);
    this.queue[indexToInsert] = obj;
    this.indexOrder.push(indexToInsert);
  }

  dequeue() {
    if (!this.indexOrder.length) return null;
    return this.queue.splice(this.indexOrder.shift(), 1, null)[0];
  }
}


let queue = new CircularQueue(3);
console.log(queue.dequeue() === null);

queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue() === 1);

queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue() === 2);

queue.enqueue(5);
queue.enqueue(6);
queue.enqueue(7);
console.log(queue.dequeue() === 5);
console.log(queue.dequeue() === 6);
console.log(queue.dequeue() === 7);
console.log(queue.dequeue() === null);

let anotherQueue = new CircularQueue(4);
console.log(anotherQueue.dequeue() === null);

anotherQueue.enqueue(1);
anotherQueue.enqueue(2);
console.log(anotherQueue.dequeue() === 1);

anotherQueue.enqueue(3);
anotherQueue.enqueue(4);
console.log(anotherQueue.dequeue() === 2);

anotherQueue.enqueue(5);
anotherQueue.enqueue(6);
anotherQueue.enqueue(7);
console.log(anotherQueue.dequeue() === 4);
console.log(anotherQueue.dequeue() === 5);
console.log(anotherQueue.dequeue() === 6);
console.log(anotherQueue.dequeue() === 7);
console.log(anotherQueue.dequeue() === null);