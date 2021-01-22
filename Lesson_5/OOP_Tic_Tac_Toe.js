let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "0";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  displayWithClear() {
    console.clear();
    console.log("\n");
    this.display();
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"].toString()}  |  ${this.squares["2"].toString()}  |  ${this.squares["3"].toString()}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"].toString()}  |  ${this.squares["5"].toString()}  |  ${this.squares["6"].toString()}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"].toString()}  |  ${this.squares["8"].toString()}  |  ${this.squares["9"].toString()}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(location, symbol) {
    this.squares[location].setMarker(symbol);
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();

    this.board.display();
    while (true) {

      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;
      this.board.displayWithClear();
    }

    this.board.displayWithClear();
    this.displayResults();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring");
    }
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  humanMoves() {

    let choice;
    let validChoices = this.board.unusedSquares();
    while (true) {
      choice = readline.question(`Choose a square between (${validChoices.join(", ")}): `);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice;
    let validChoices = this.board.unusedSquares();

    while (true) {
      choice = Math.floor(((9 * Math.random()) + 1));
      if (validChoices.includes(choice.toString())) break;
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  gameOver() {
    return this.boardIsFull() || this.someoneWon();
  }

  boardIsFull() {
    let unusedSquares = this.board.unusedSquares();
    return unusedSquares.length === 0;
  }

  someoneWon() {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.isWinner(this.human) || this.isWinner(this.computer);
    });
  }
}


let game = new TTTGame();
game.play();