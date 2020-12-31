const readline = require('readline-sync');
const GAME_MOVES_KEY = {
  rock:  { defeatedBy: ['paper', 'spock'] },
  paper:  { defeatedBy: ['scissors', 'lizard']},
  scissors: { defeatedBy: ['spock', 'rock']},
  lizard:  { defeatedBy: ['scissors','rock']},
  spock: { defeatedBy: ['lizard', 'paper']}
};
const FINAL_ROUND = 5;

function createPlayer() {
  return {
    moves: [],
    score: 0,


    getCurrentMove() {
      return this.moves[this.moves.length - 1];
    },
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject =  {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, lizard, or spock');
        choice = readline.question().toLowerCase();
        if (Object.keys(GAME_MOVES_KEY).includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }
      this.moves.push(choice);
    },
  };

  return Object.assign(playerObject, humanObject);
}

const history = {
  movesHistory: {
    rock: {wins: 0, totalPlays: 0},
    paper: {wins: 0, totalPlays: 0},
    scissors: {wins: 0, totalPlays: 0},
    lizard: {wins: 0, totalPlays: 0},
    spock: {wins: 0, totalPlays: 0},
  },

  calculateWeights() {
    return ['rock', 'paper', 'scissors', 'lizard', 'spock'].map(move => {
      let wins = this.movesHistory[move].wins;
      let totalPlays = this.movesHistory[move].totalPlays;
      let weight = totalPlays > 2 ? wins / totalPlays : 0.5;
      return weight > 0.1 ? weight : 0.1;
    });
  },

  calculateThresholds() {
    let weights = this.calculateWeights();
    let weightsSum = weights.reduce((acc, num) => acc + num);
    let runningTotal = 0;
    return ['rock', 'paper', 'scissors', 'lizard', 'spock'].map((move, idx) => {
      runningTotal += weights[idx] / weightsSum;
      return {name: move, threshold: runningTotal};
    });
  },
};

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    move : null,


    choose () {
      let randomNum = Math.random();
      let choice = this.calculateThresholds().find(choice => {
        if (randomNum < choice.threshold) return choice;
        return false;
      });
      this.moves.push(choice ? choice.name : 'spock');
    },
  };

  return Object.assign(playerObject, computerObject, history);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  round: 1,
  roundWinner: null,


  updatePlayersStatus() {
    let humanMove = this.human.getCurrentMove();
    let computerMove = this.computer.getCurrentMove();
    this.computer.movesHistory[computerMove].totalPlays += 1;

    if (GAME_MOVES_KEY[computerMove].defeatedBy.includes(humanMove)) {
      this.human.score += 1;
      this.roundWinner = 'human';
    } else if (GAME_MOVES_KEY[humanMove].defeatedBy.includes(computerMove)) {
      this.computer.score += 1;
      this.computer.movesHistory[computerMove].wins += 1;
      this.roundWinner = 'computer';
    } else {
      this.roundWinner = 'tie';
    }
  },

  resetScoring() {
    this.round = 1;
    this.human.score = 0;
    this.human.moves = [];
    this.computer.score = 0;
    this.computer.moves = [];
  },

  displayHeader() {
    console.clear();
    console.log(
      '        Lizard Spock: Best of 5\n' +
      `    Round: ${this.round}  Player: ${this.human.score}  ` +
      `Computer: ${this.computer.score}\n` +
      '=======================================\n');
  },

  displayRoundResult () {
    console.log(`\nYou chose: ${this.human.getCurrentMove()}`);
    console.log(`The computer chose: ${this.computer.getCurrentMove()}\n`);

    if (this.roundWinner === 'human') {
      console.log(`You've won round ${this.round}`);
    } else if (this.roundWinner === 'computer') {
      console.log(`The computer won round ${this.round}`);
    } else {
      console.log(`Round ${this.round} ended in a tie.`);
    }

    console.log(this.computer.calculateThresholds());
    console.log('\nPlease Press Enter to Proceed');
    readline.question();
  },

  displayBestOfResult() {
    console.log('\n     Round    Human      Computer');
    console.log('     -----    -----      --------');
    for (let index = 0; index < FINAL_ROUND; index += 1) {
      console.log(`       ${index + 1}` +
                  `      ${this.human.moves[index].padEnd(11, ' ')}` +
                  `${this.computer.moves[index]}`);
    }

    if (this.human.score > this.computer.score) {
      console.log("\n    You've won the best of 5 series!\n");
    } else if (this.human.score < this.computer.score) {
      console.log("\n    The computer won the best of 5 series\n");
    } else {
      console.log("\n    The best of 5 series ends in a tie\n");
    }

  },

  playAgain() {
    console.log('\nWould you like to play again? (y/n)');
    return readline.question()[0].toLowerCase() === 'y';
  },

  displayGoodbyeMessage() {
    console.clear();
    console.log('Thanks for playing. Goodbye!');
  },

  play() {
    while (true) {
      while (true) {
        this.displayHeader();
        this.computer.choose();
        this.human.choose();
        this.updatePlayersStatus();
        this.displayRoundResult();
        if (this.round === 5) break;
        this.round += 1;
      }
      this.displayHeader();
      this.displayBestOfResult();
      if (!this.playAgain()) break;
      this.resetScoring();
    }
    this.displayGoodbyeMessage();
  },
};


RPSGame.play();