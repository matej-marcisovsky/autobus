import Card from "./Card.js";
import Rank from "./Rank.js";
import Suit from "./Suit.js";

export default class Joker extends Card {
  constructor() {
    // Random values. Not important.
    super(Suit.Club, Rank.Ace);
  }
}
