/*

///////// Textual Description \\\\\\\\\\
RPS is a two-player game where each player chooses one of three possible moves:
rock, paper, or scissors. The winner is chosen by comparing their move with the
following rules...

* Rock crushes scissors, i.e., rock wins against scissors
* Scissors cuts paper, i.e., scissors beats paper
* Paper wraps rock, i.e., paper beats rock
* If the players chose the same move, the game is a tie


///////// Extract Nouns/Verbs \\\\\\\\\\
Nouns: player, move, rule
Verbs: choose, compare


///////// Extract Nouns/Verbs \\\\\\\\\\
Player
  - choose
Move
Rule

???
 - compare

*/
const readline = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject =  {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, or scissors');
        choice = readline.question().toLowerCase();
        if (['rock', 'paper', 'scissors'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computreObject = {
    move : null,

    choose () {
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computreObject);
}

// function createMove() {
//   return {

//   };
// }

// function createRule() {
//   return {

//   };
// }

// let compare = function(move1, move2) {

// };

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomMessages() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    return readline.question()[0].toLowerCase() === 'y';
  },

  displayWinner () {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
    (humanMove === 'paper' && computerMove === 'rock') ||
    (humanMove === 'scissors' && computerMove === 'paper')) {
      console.log('You win!');
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
           (humanMove === 'paper' && computerMove === 'scissors') ||
           (humanMove === 'scissors' && computerMove === 'rock')) {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
    }
  },

  play() {
    while (true) {
      this.displayWelcomMessages();
      this.computer.choose();
      this.human.choose();
      this.displayWinner();
      this.displayGoodbyeMessage();
      if (!this.playAgain()) break;
    }
  },
};


RPSGame.play();