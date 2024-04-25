import type { Card } from './Card.js';
// import Joker from "./Joker.js";
import { Origin } from './enums.js';
import { InvalidGameMove } from './Errors.js';

const PILE_COUNT = 5;

export const ERROR_CARD_NOT_IN_ORIGIN = 'Card not in origin.';
const ERROR_NO_PILE = 'No appropriate pile left.';

export class Player {
  readonly id: number;
  stock: Card[];
  hand: Card[];
  piles: Card[][] = [];
  hasUser: boolean = false;

  get stockCard() {
    return this.stock[0];
  }

  constructor(
    id: number,
    stock: Card[],
    hand: Card[],
    piles?: Card[][],
    hasUser: boolean = false,
  ) {
    this.id = id;
    this.stock = stock;
    this.hand = hand;
    this.hasUser = hasUser;

    if (piles) {
      this.piles = piles;
    } else {
      this.initPiles();
    }
  }

  private initPiles() {
    for (let index = 0; index < PILE_COUNT; index++) {
      this.piles.push([]);
    }
  }

  findCardInOrigin(card: Card, origin: Origin) {
    const { hand, piles, stock } = this;

    if (origin === Origin.Hand) {
      return hand.find(handCard => handCard.isSame(card));
    }

    if (origin === Origin.Pile) {
      const pile = piles.find(pile => pile.length && pile[0].isSame(card));

      return pile?.[0];
    }

    if (origin === Origin.Stock && stock[0].isSame(card)) {
      return stock[0];
    }
  }

  isCardInOrigin(card: Card, origin: Origin): boolean {
    const { hand, piles, stock } = this;

    if (origin === Origin.Hand) {
      return hand.includes(card);
    }

    if (origin === Origin.Pile) {
      return !!piles.find(pile => pile.includes(card));
    }

    if (origin === Origin.Stock) {
      return stock.includes(card);
    }

    return false;
  }

  moveCardToOrigin(card: Card, origin: Origin) {
    if (!this.isCardInOrigin(card, Origin.Hand) || origin === Origin.Hand) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_ORIGIN);
    }

    const { piles, stock } = this;

    if (origin === Origin.Pile) {
      let pile = piles.find(
        _pile => _pile.length && _pile[0].rank === card.rank,
      );

      if (!pile) {
        pile = piles.find(_pile => !_pile.length);
      }

      if (!pile) {
        throw new InvalidGameMove(ERROR_NO_PILE);
      }

      pile.unshift(card);
    }

    if (origin === Origin.Stock) {
      stock.push(card);
    }

    this.removeCardFromOrigin(card, Origin.Hand);
  }

  removeCardFromOrigin(card: Card, origin: Origin) {
    if (!this.isCardInOrigin(card, origin)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_ORIGIN);
    }

    const { hand, piles, stock } = this;

    if (origin === Origin.Hand) {
      hand.splice(this.hand.indexOf(card), 1);
    }

    if (origin === Origin.Pile) {
      const pile = piles.find(pile => pile.length && pile[0].isSame(card));

      if (pile) {
        pile.splice(0, 1);
      }
    }

    if (origin === Origin.Stock) {
      stock.splice(0, 1);
    }
  }
}
