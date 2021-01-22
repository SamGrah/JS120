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

  emptySquareIn(keys) {
    let emptySquare = keys.find(key => {
      let square = this.squares[key];
      return square.isUnused(square.getMarker());
    });
    return emptySquare ? emptySquare : '';
  }

  isDefensivePositionOpen() {
    return this.squares['5'].getMarker() === Square.UNUSED_SQUARE;
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
    this.wins = 0;
  }

  getMarker() {
    return this.marker;
  }

  getWins() {
    return this.wins;
  }

  incrementWins() {
    this.wins += 1;
  }

  resetWins() {
    this.wins = 0;
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
  static NUMBER_OF_ROUNDS = 5;
  static GAME_WINS_THRESHOLD = 3;
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
    this.player1Move = this.humanMoves;
    this.player2Move = this.computerMoves;
    this.round = 4;
  }

  play() {
    while (true) {
      this.displayGame();

      while (true) {
        this.player1Move();
        if (this.roundOver()) break;
        this.displayGame();

        this.player2Move();
        if (this.roundOver()) break;
        this.displayGame();
      }

      this.updateGameStats();
      this.displayResults();
      if (!this.gameWinner()) {
        this.roundReset();
        continue;
      }
      if (!this.playAdditionalGame()) break;
      this.newGame();
    }

    this.displayGoodbyeMessage();
  }

  static joinOr(choices, delimiter = ', ', finalDelimiter = 'or') {
    if (!choices.length) {
      return '';
    } else if (choices.length === 1) {
      return choices[0];
    } else if (choices.length === 2) {
      return `${choices[0]} ${finalDelimiter} ${choices[1]}`;
    } else {
      return choices.slice(0, choices.length - 1).join(delimiter) +
             `${delimiter}${finalDelimiter} ${choices[choices.length - 1]}`;
    }
  }

  playAdditionalGame() {
    let replayChoice;
    while (true) {
      console.log("");
      replayChoice = readline.question("Play another game? \nEnter 'y' or 'n': ");
      replayChoice = replayChoice.toLowerCase();
      if (['y', 'n'].includes(replayChoice)) break;
      console.log(replayChoice + " isn't a valid choice.");
    }
    return replayChoice === 'y';
  }

  displayGame() {
    console.clear();
    console.log('TIC TAC TOE Best of 5');
    console.log(`You are ${this.human.getMarker()}. ` +
                `Computer is ${this.computer.getMarker()}\n`);
    console.log('      GAMES WON\n========================');
    console.log(`Player: ${this.human.wins}    ` +
                `Computer: ${this.computer.wins}`);
    this.board.display();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("\nThanks for playing Tic Tac Toe! Goodbye!");
  }

  displayResults() {
    this.displayGame();
    if (this.gameWinner() === 'human') {
      console.log("You won the game! Congratulations! ");
    } else if (this.gameWinner() === 'computer') {
      console.log("AI domination! The computer won the game ");
    } else if (this.gameWinner() === 'tie') {
      console.log("Game ends in a tie y'all");
    } else if (this.wonRound(this.human)) {
      console.log(`You won round ${this.round}`);
    } else if (this.wonRound(this.computer)) {
      console.log(`I won round ${this.round}! Take that, human!`);
    } else {
      console.log(`Round ${this.round} ends in a tie. How boring`);
    }

    if (!this.gameWinner()) {
      readline.question('\nPress Enter to continue to next round.');
    }
  }

  humanMoves() {
    let choice;
    let validChoices = this.board.unusedSquares();
    while (true) {
      choice = readline.question(`Choose a square (${TTTGame.joinOr(validChoices)}): `);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice;
    let validChoices = this.board.unusedSquares();

    let potentialWinner = this.isWinningSquareFor(this.computer) ||
                          this.isWinningSquareFor(this.human);
    if (potentialWinner) {
      choice = potentialWinner;
    } else if (this.board.isDefensivePositionOpen()) {
      choice = 5;
    } else {
      while (true) {
        choice = Math.floor(((9 * Math.random()) + 1));
        if (validChoices.includes(choice.toString())) break;
      }
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  updateGameStats() {
    if (this.wonRound(this.human)) this.human.incrementWins();
    if (this.wonRound(this.computer)) this.computer.incrementWins();
  }

  roundOver() {
    return this.boardIsFull() || this.someoneWonRound();
  }

  roundReset() {
    this.resetBoard();
    [this.player1Move, this.player2Move] = [this.player2Move, this.player1Move];
    this.round += 1;
  }

  boardIsFull() {
    let unusedSquares = this.board.unusedSquares();
    return unusedSquares.length === 0;
  }

  wonRound(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  someoneWonRound() {
    return TTTGame.POSSIBLE_WINNING_ROWS.some( _ => {
      return this.wonRound(this.human) || this.wonRound(this.computer);
    });
  }

  gameWinner() {
    let result;
    if (this.human.wins === TTTGame.GAME_WINS_THRESHOLD) {
      result = 'human';
    } else if (this.computer.wins === TTTGame.GAME_WINS_THRESHOLD) {
      result = 'computer';
    } else if (this.round === TTTGame.NUMBER_OF_ROUNDS) {
      if (this.human.wins === this.computer.wins) {
        result = 'tie';
      } else if (this.human.wins > this.computer.wins) {
        result = 'human';
      } else {
        result = 'computer';
      }
    } else {
      result = false;
    }
    return result;
  }

  gameOver() {
    return this.round > TTTGame.NUMBER_OF_ROUNDS ||
           this.human.wins === TTTGame.GAME_WINS_THRESHOLD ||
           this.computer.wins === TTTGame.GAME_WINS_THRESHOLD;
  }

  isWinningSquareFor(player) {
    let winningRow = TTTGame.POSSIBLE_WINNING_ROWS.find(row => {
      return this.board.countMarkersFor(player, row) === 2 &&
             this.board.emptySquareIn(row);
    });
    if (!winningRow) return false;
    return this.board.emptySquareIn(winningRow);
  }

  resetBoard() {
    this.board = new Board();
  }

  newGame() {
    this.roundReset();
    this.round = 1;
    this.human.resetWins();
    this.computer.resetWins();
  }

}


let game = new TTTGame();
game.play();