import Suit from "./Suit.js";
import Rank from "./Rank.js";
import Card from "./Card.js";

export default class Joker extends Card {
  constructor() {
    // Random values. Not important.
    super(Suit.Club, Rank.Ace);
  }
}
