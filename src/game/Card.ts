import { Color, Rank, Suit } from './enums.js';

const RANK_EVALUATION = Object.freeze({
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
  [Rank.King]: 12,
});

export class Card {
  readonly isJoker: boolean;
  readonly suit: Suit;

  rank: Rank;

  get color(): Color {
    if (this.suit === Suit.Diamond || this.suit === Suit.Heart) {
      return Color.Red;
    }

    return Color.Black;
  }

  get isUnusedJoker(): boolean {
    return this.isJoker && this.rank === Rank.Joker;
  }

  get nextRank(): Rank {
    if (this.rank === Rank.Joker) {
      throw new Error('Joker has no next rank.');
    }

    return Object.entries(RANK_EVALUATION).find(
      // @ts-expect-error Jokers are handled above.
      ([_, evaluation]) => evaluation === RANK_EVALUATION[this.rank] + 1,
    )?.[0] as Rank;
  }

  constructor(suit: Suit, rank: Rank, isJoker: boolean) {
    this.isJoker = isJoker;
    this.suit = suit;
    this.rank = rank;
  }

  isNextRankOf(card: Card): boolean {
    /**
     * Joker was not used in straight.
     */
    if (this.isUnusedJoker) {
      return card.rank !== Rank.King;
    }

    /**
     * Incoming card is Joker and has not been used in straight.
     */
    if (card.isUnusedJoker) {
      return false;
    }

    // @ts-expect-error Jokers are handled above.
    return RANK_EVALUATION[this.rank] === RANK_EVALUATION[card.rank] + 1;
  }

  isSame(card: Card): boolean {
    if (this.isUnusedJoker && card.isUnusedJoker) {
      return true;
    }

    return card.rank === this.rank && card.suit === this.suit;
  }
}
