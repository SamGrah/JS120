////////// PROBLEMS 1, 2, 3 \\\\\\\\\\

function createBook(title, author) {
  return {
    title,
    author,

    getDescription: function () {
      return `${this.title} was written by ${this.author}`;
    }
  };
}

let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook("Aunts aren't Gentlemen", 'PG Wodehouse');

////////// PROBLEM 4 \\\\\\\\\\

function createBook(title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription: function () {
      return `${this.title} was written by ${this.author}. ` +
             `I ${this.read ? "have" : "haven't"} read it.`;
    },

    readBook: function () {
      this.read = true;
    } 
  };
}

book1.readBook();
console.log(book1.getDescription());
console.log(book2.getDescription());
console.log(book3.getDescription());
