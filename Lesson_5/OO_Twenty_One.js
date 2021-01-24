let readline = require("readline-sync");

class Card {
  constructor(faceValue, suit) {
    this.faceValue = faceValue;
    this.suit = suit;
  }

  static ACE_LOW_VALUE = 1;
  static ACE_HIGH_VALUE = 11;
  static FACE_CARD_VALUE = 10;

  static faceValues = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Jack', 'Queen', 'King'];

  static suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

  getFaceValue() {
    return this.faceValue;
  }

  getScoringValue() {
    if (!isNaN(Number(this.faceValue))) return Number(this.faceValue);
    if (this.faceValue === 'Ace') return Card.ACE_LOW_VALUE;
    return Card.FACE_CARD_VALUE;
  }
}

class Deck {
  constructor() {
    this.availableCards = [];
    Card.faceValues.forEach(faceValue => {
      Card.suits.forEach(suit => {
        let card = new Card(faceValue, suit);
        this.availableCards.push(card);
      });
    });
  }

  randomlyDrawFrom() {
    let numberOfCards = this.availableCards.length;
    let randomCardIndex = Math.floor(numberOfCards * Math.random());
    return this.availableCards.splice(randomCardIndex, 1)[0];
  }
}

class Participant {
  constructor() {
    this.score = 0;
    this.hand = [];
  }

  updateHandScore() {
    let handScores = this.hand.map(card => card.getScoringValue());
    let lowScore = handScores.reduce((acc, val) => acc + val, 0);
    let highScore = lowScore;

    let handFaceValues = this.hand.map(card => card.getFaceValue());
    if (handFaceValues.includes('Ace')) {
      highScore += Card.ACE_HIGH_VALUE - Card.ACE_LOW_VALUE;
    }

    this.score = highScore > 21 ? lowScore : highScore;
  }

  getScore() {
    return this.score;
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  emptyHand() {
    this.hand = [];
  }

  isBusted() {
    return this.score > 21;
  }

}

class Player extends Participant {
  constructor() {
    super();
    this.cash = 5;
  }

  static RICH_AMOUNT = 10;
  static BROKE_AMOUT = 0;

  getCash() {
    return this.cash;
  }

  takeDollar() {
    this.cash -= 1;
  }

  giveDollar() {
    this.cash += 1;
  }

  isRich() {
    return this.cash === Player.RICH_AMOUNT;
  }

  isBroke() {
    return this.cash === Player.BROKE_AMOUT;
  }

  displayHand() {
    let faceValues = this.hand.map(card => card.getFaceValue());

    let message;
    if (faceValues.length === 2) {
      message = faceValues[0] + ' and a ' + faceValues[1];
    } else {
      message = faceValues.slice(0, -1);
      message = message.concat('and a ' + faceValues.slice(-1)).join(', ');
    }
    console.log(`You have: ${message}\n`);
  }
}

class Dealer extends Participant {

  constructor() {
    super();
    this.hideHand = true;
  }

  static DEALER_HIT_THRESHOLD = 17;

  handHidden() {
    this.hideHand = true;
  }

  showHand() {
    this.hideHand = false;
  }

  displayHand() {
    let faceValues = this.hand.map(card => card.getFaceValue());

    let message;
    if (this.hideHand) {
      message = faceValues[0] + ' and an unknown card';
    } else if (faceValues.length === 2) {
      message = faceValues[0] + ' and a ' + faceValues[1];
    } else {
      message = faceValues.slice(0, -1);
      message = message.concat('and a ' + faceValues.slice(-1)).join(', ');
    }
    console.log(`Dealer has: ` + message);
  }
}

class TwentyOneGame {
  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
    this.deck = new Deck();
    this.round = 0;
    readline.setPrompt('==> ');
  }

  static MATCH_WINS_THRESHOLD = 3;

  static validateEntry(entry, validEntries) {
    while (!validEntries.includes(entry)) {
      console.log(`==> '${entry}' is not a valid input, ` +
                    `please enter '${validEntries[0]}' or '${validEntries[1]}'`);
      entry = readline.question('==> ').toLowerCase();
    }
    return entry;
  }

  start() {
    this.displayWelcomMessage();
    while (true) {
      while (true) {
        this.shuffleCards();
        this.dealCards();
        this.playerTurn();
        this.dealerTurn();
        this.updatePlayerCash();
        this.displayRoundResult();
        if (this.matchOver()) break;
      }
      this.displayMatchResult();

      if (!this.playAdditionalMatch()) break;
      this.matchStatsReset();
    }

    this.displayGoodbyeMessage();
  }

  shuffleCards() {
    this.player.emptyHand();
    this.dealer.emptyHand();
    this.dealer.handHidden();
    this.deck = new Deck();
  }

  dealCards() {
    this.round += 1;
    for (let iterations = 0; iterations < 2; iterations++) {
      this.player.addCardToHand(this.deck.randomlyDrawFrom());
      this.dealer.addCardToHand(this.deck.randomlyDrawFrom());
    }
  }

  playerTurn() {
    this.player.updateHandScore();

    while (true) {
      this.displayGameInfo();
      if (this.player.isBusted()) break;

      this.prompt("'hit' or 'stay'?");
      let answer = readline.prompt().toLowerCase();
      TwentyOneGame.validateEntry(answer, ['hit', 'stay']);

      if (answer === 'stay') break;
      this.player.addCardToHand(this.deck.randomlyDrawFrom());
      this.player.updateHandScore();
      if (this.player.isBusted()) break;
    }
  }

  dealerTurn() {
    this.dealer.showHand();
    this.dealer.updateHandScore();
    if (this.player.isBusted()) return;
    while (true) {
      if (this.dealer.getScore() >= Dealer.DEALER_HIT_THRESHOLD) break;
      this.dealer.addCardToHand(this.deck.randomlyDrawFrom());
      this.dealer.updateHandScore();
    }
  }

  prompt(message) {
    return console.log("==> " + message);
  }

  updatePlayerCash() {
    let winner = this.determineWinner();
    if (winner === 'player') this.player.giveDollar();
    else if (winner === 'dealer') this.player.takeDollar();
  }

  determineWinner() {
    let playerScore = this.player.getScore();
    let dealerScore = this.dealer.getScore();

    if (this.dealer.isBusted()) return 'player';
    else if (this.player.isBusted()) return 'dealer';
    else if (playerScore > dealerScore) return 'player';
    else if (dealerScore > playerScore) return 'dealer';
    return 'tie';
  }

  matchOver() {
    return this.player.isRich() || this.player.isBroke();
  }

  matchStatsReset() {
    this.round = 1;
    this.player = new Player();
    this.dealer = new Dealer();
  }

  displayRoundInfo() {
    console.log(`\n\n               ROUND ${this.round}\n` +
    '========================================');
  }

  displayGameHeader() {
    console.clear();
    console.log('              TWENTY-ONE\n' +
                '========================================');
    console.log(`            Player Cash: $${this.player.getCash()}`);
  }

  displayGameInfo() {
    this.displayGameHeader();
    this.displayRoundInfo();
    this.dealer.displayHand();
    this.player.displayHand();
  }

  displayRoundResult() {
    this.displayGameInfo();
    let winner = this.determineWinner();
    let playerScore = this.player.getScore();
    let dealerScore = this.dealer.getScore();

    console.log('');
    if (this.dealer.isBusted()) console.log(`Dealer busted at ${dealerScore}. Player Wins.`);
    else if (this.player.isBusted()) console.log(`Player busted at ${playerScore}. Dealer Wins.`);
    else if (winner === 'player') {
      console.log(`Player defeats dealer ${playerScore} to ${dealerScore}`);
    } else if (winner === 'dealer') {
      console.log(`Dealer defeats player ${dealerScore} to ${playerScore}`);
    } else if (winner === 'tie') {
      console.log(`Round ends in a ${playerScore} to ${dealerScore} tie!`);
    }

    console.log('');
    this.prompt('Press Enter to continue to next round');
    readline.question();
  }

  displayMatchResult() {
    this.displayGameHeader();
    console.log('');

    if (this.player.isRich()) {
      console.log("You've won $5! Quit while you're ahead!");
    } else {
      console.log("No more money to bet with...you lose :(");
    }
  }

  playAdditionalMatch() {
    console.log('');
    this.prompt("Play an additional match? Enter 'y' or 'n': ");
    let answer = readline.prompt().toLowerCase();
    answer = TwentyOneGame.validateEntry(answer, ['y', 'n']);
    return answer === 'y';
  }

  displayWelcomMessage() {
    console.clear();
    console.log('Welcome to Twenty-One!\n');
    console.log('You begin the game with $5. For each round you win\n' +
                'a dollar will be added to your cash pile and a \n' +
                'dollar removed for each round you lose.\n' +
                'The game will end if your cash pile is $0 or $10.\n');
    readline.question('Please press Enter to begin...');
  }


  displayGoodbyeMessage() {
    console.clear();
    console.log('Thanks for playing.\nHave a nice day :)');
  }
}

let game = new TwentyOneGame();
game.start();