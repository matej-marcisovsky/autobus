import Card from "./Card.js";
import { addJokers, generate } from "./Deck.js";
import Player, { ERROR_CARD_NOT_IN_HAND } from "./Player.js";
import { InvalidGameMove, UnknownPlayer } from "./Errors.js";
import Rank from "./Rank.js";
import Joker from "./Joker.js";

const PLAYER_STOCK_CARD_COUNT = 15;
const PLAYER_HAND_CARD_COUNT = 5;

const ERROR_HAND_FULL = 'Hand is full.';

export default class Game {
  id: number;
  stock: Card[] = generate();
  pile: Card[] = [];
  players: Player[] = [];
  straights: Array<Card[]> = [];
  currentPlayer: Player;

  constructor(id: number, playerCount: number) {
    this.id = id;
    this.initPlayers(playerCount);
    this.stock = addJokers(this.stock);

    this.currentPlayer = this.players[0];
  }

  private drawCards() {
    const player = this.players.find((_player) => _player === this.currentPlayer);

    if (!player) {
      throw new UnknownPlayer();
    }

    const playerHandLength = player.hand.length;

    if (playerHandLength >= PLAYER_HAND_CARD_COUNT) {
      throw new InvalidGameMove(ERROR_HAND_FULL);
    }

    // TODO handle jokers

    player.hand.splice(playerHandLength, 0, ...this.stock.splice(0, PLAYER_HAND_CARD_COUNT - playerHandLength));
  }

  private initPlayers(playerCount: number) {
    for (let index = 0; index < playerCount; index++) {
      this.players.push(new Player(index, this.stock.splice(0, PLAYER_STOCK_CARD_COUNT), this.stock.splice(0, PLAYER_HAND_CARD_COUNT)));
    }
  }

  private switchToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.currentPlayer);

    if (currentPlayerIndex === -1) {
      throw new UnknownPlayer();
    }

    let nextPlayerIndex = currentPlayerIndex + 1;

    if (nextPlayerIndex === this.players.length) {
      nextPlayerIndex = 0;
    }

    this.currentPlayer = this.players[nextPlayerIndex];
  }

  endTurn() {
    this.drawCards();
    this.switchToNextPlayer();
  }

  moveCardToStraight(card: Card, straight: Card[] = null) {
    if (!this.currentPlayer.isCardInHand(card)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_HAND);
    }

    // Starting new straight.
    if ((card.rank === Rank.Ace || card instanceof Joker) && !straight) {
      this.straights.push([card]);

      return;
    }

    // TODO
  }
}
