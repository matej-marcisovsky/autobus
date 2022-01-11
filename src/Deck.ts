import arrayShuffle from "array-shuffle";

import Suit from "./Suit.js";
import Rank from "./Rank.js";
import Card from "./Card.js";

// const JOKERS_PER_DECK = 2;
const DECK_MULTIPLIER = 2;

export default class Deck {
  cards: Card[];

  constructor() {
    this.cards = [];
    this.generate();
  }

  private generate() {
    for (let i = 0; i < DECK_MULTIPLIER; i++) {
      for (const suit in Suit) {
        for (const rank in Rank) {
          // if (Rank[rank] === Rank.Joker) {
          //   continue;
          // }

          this.cards.push(new Card(
            Suit[suit],
            Rank[rank]
          ));
        }
      }

      // for (let j = 0; j < JOKERS_PER_DECK; j++) {
      //   this.cards.push(new Card(
      //     Suit.Club,
      //     Rank.Joker
      //   ));
      // }
    }
  }

  shuffle() {
    this.cards = arrayShuffle(this.cards);
  }
}
