import Card from "./Card.js";
import Joker from "./Joker.js";
import { InvalidGameMove } from "./Errors.js";
import Origin from "./Origin.js";

const PILE_COUNT = 5;

export const ERROR_CARD_NOT_IN_ORIGIN = 'Card not in origin.';
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

  findCardInOrigin(card: Card, origin: Origin): Card {
    const { hand, piles, stock } = this;

    switch (origin) {
      case Origin.Hand:
        return hand.find(handCard => handCard.isSame(card));
      case Origin.Pile:
        const pile = piles.find(pile => pile[0].isSame(card));

        if (pile) {
          return pile[0];
        }
      case Origin.Stock:
        if (stock[0].isSame(card)) {
          return stock[0];
        }
      default:
        return null;
    }
  }

  isCardInOrigin(card: Card, origin: Origin): boolean {
    const { hand, piles, stock } = this;

    switch (origin) {
      case Origin.Hand:
        return hand.includes(card);
      case Origin.Pile:
        return !!piles.find(pile => pile.includes(card));
      case Origin.Stock:
        return stock.includes(card);
      default:
        return false;
    }
  }

  moveCardToOrigin(card: Card, origin: Origin) {
    if (!this.isCardInOrigin(card, Origin.Hand)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_ORIGIN);
    }

    const { piles, stock } = this;

    switch (origin) {
      case Origin.Pile:
        let pile = piles.find((_pile) => _pile.length && _pile[0].rank === card.rank);

        if (!pile) {
          pile = piles.find((_pile) => !_pile.length);
        }

        if (!pile) {
          throw new InvalidGameMove(ERROR_NO_PILE);
        }

        pile.unshift(card);
        break;
      case Origin.Stock:
        stock.push(card);
        break
      default:
        throw new InvalidGameMove();
    }

    this.removeCardFromOrigin(card, Origin.Hand);
  }

  removeCardFromOrigin(card: Card, origin: Origin) {
    if (!this.isCardInOrigin(card, origin)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_ORIGIN);
    }

    const { hand, piles, stock } = this;

    switch (origin) {
      case Origin.Hand:
        return hand.splice(this.hand.indexOf(card), 1);
      case Origin.Pile:
        const pile = piles.find(pile => pile[0].isSame(card));

        if (pile) {
          pile.splice(0, 1);
        }

        return;
      case Origin.Stock:
        return stock.splice(0, 1);
    }
  }
}
