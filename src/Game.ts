import Deck from "./Deck.js";
import Player from "./Player.js";

const PLAYER_DECK_CARD_COUNT = 15;
const PLAYER_HAND_CARD_COUNT = 5;

export default class Game {
  deck: Deck = new Deck();
  players: Array<Player> = [];

  constructor(playerCount: number) {
    this.deck.shuffle();
    this.initPlayers(playerCount);
  }

  private initPlayers(playerCount: number) {
    for (let index = 0; index < playerCount; index++) {
      this.players.push(new Player(index, this.deck.cards.splice(0, PLAYER_DECK_CARD_COUNT), this.deck.cards.splice(0, PLAYER_HAND_CARD_COUNT)));
    }
  }
}

// TEST
const game = new Game(2);

console.log(game.deck.cards.length);
console.log(game.deck);
console.log(game.players);

game.players[0].moveCardToPile(game.players[0].hand[0]);

console.log(game.players);
console.log(game.players[0].piles[0]);
