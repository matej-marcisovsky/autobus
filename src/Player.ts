import Card from "./Card.js";
import Joker from "./Joker.js";
import { InvalidGameMove } from "./Errors.js";

const PILE_COUNT = 4;

export const ERROR_CARD_NOT_IN_HAND = 'Card not in hand.';
const ERROR_NO_PILE = 'No appropriate pile left.';

export default class Player {
  readonly id: number;
  stock: Card[];
  hand: Card[];
  jokers: Joker[] = [];
  piles: Array<Card[]> = [];

  get stockCard() {
    return this.stock[0];
  }

  constructor(id: number, stock: Card[], hand: Card[]) {
    this.id = id;
    this.stock = stock;
    this.hand = hand;

    this.initPiles();
  }

  private initPiles() {
    for (let index = 0; index < PILE_COUNT; index++) {
      this.piles.push([]);
    }
  }

  private removeCardFromHand(card: Card) {
    if (!this.isCardInHand(card)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_HAND);
    }

    this.hand.splice(this.hand.indexOf(card), 1);
  }

  isCardInHand(card: Card): boolean {
    return this.hand.includes(card);
  }

  moveCardToStock(card: Card) {
    if (!this.isCardInHand(card)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_HAND);
    }

    this.stock.push(card);
    this.removeCardFromHand(card);
  }

  moveCardToPile(card: Card) {
    if (!this.isCardInHand(card)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_HAND);
    }

    let pile = this.piles.find((_pile) => _pile.length && _pile[0].rank === card.rank);

    if (!pile) {
      pile = this.piles.find((_pile) => !_pile.length);
    }

    if (pile) {
      pile.unshift(card);
      this.removeCardFromHand(card);

      return;
    }

    throw new InvalidGameMove(ERROR_NO_PILE);
  }
}
