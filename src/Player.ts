import Card from "./Card.js";
import { InvalidGameMove } from "./Errors.js";

const PILE_COUNT = 4;

const ERROR_CARD_NOT_IN_HAND = 'Card not in hand.';
const ERROR_NO_PILE = 'No appropriate pile left.';

export default class Player {
  readonly id: number;
  deck: Card[];
  hand: Card[];
  piles: Array<Card[]> = [];

  get deckCard() {
    return this.deck[0];
  }

  constructor(id: number, deck: Card[], hand: Card[]) {
    this.id = id;
    this.deck = deck;
    this.hand = hand;

    this.initPiles();
  }

  private initPiles() {
    for (let index = 0; index < PILE_COUNT; index++) {
      this.piles.push([]);
    }
  }

  isCardInHand(card: Card): boolean {
    return this.hand.includes(card);
  }

  moveCardToDeck(card: Card) {
    if (!this.isCardInHand(card)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_HAND);
    }

    this.deck.push(card);
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

  removeCardFromHand(card: Card) {
    if (!this.isCardInHand(card)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_HAND);
    }

    this.hand.splice(this.hand.indexOf(card), 1);
  }
}
