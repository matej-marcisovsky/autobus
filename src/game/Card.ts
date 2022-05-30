import Color from "./Color.js";
import Suit from "./Suit.js";
import Rank from "./Rank.js";

const RANK_EVALUATION = {
  [Rank.Ace]: 0,
  [Rank.N2]: 1,
  [Rank.N3]: 2,
  [Rank.N4]: 3,
  [Rank.N5]: 4,
  [Rank.N6]: 5,
  [Rank.N7]: 6,
  [Rank.N8]: 7,
  [Rank.N9]: 8,
  [Rank.N10]: 9,
  [Rank.Jack]: 10,
  [Rank.Queen]: 11,
  [Rank.King]: 12
};

export default class Card {
  readonly suit: Suit;
  readonly rank: Rank;
  readonly color: Color;

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;

    if (suit === Suit.Diamond || suit === Suit.Heart) {
      this.color = Color.Red;
    } else {
      this.color = Color.Black;
    }
  }

  isNextRankOf(card: Card): boolean {
    return RANK_EVALUATION[this.rank] === RANK_EVALUATION[card.rank] + 1;
  }

  isSame(card: Card): boolean {
    return card.rank === this.rank && card.suit === this.suit;
  }
}
