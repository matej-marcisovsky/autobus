import Suit from "./Suit.js";
import Rank from "./Rank.js";

export default class Card {
  readonly suit: Suit;
  readonly rank: Rank;

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;
  }
}
