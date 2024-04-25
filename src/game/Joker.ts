import { Card } from './Card.js';
import { Rank, Suit } from './enums.js';

export class Joker extends Card {
  constructor() {
    // Random values. Not important.
    super(Suit.Club, Rank.Ace);
  }
}
