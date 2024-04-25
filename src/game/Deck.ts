import arrayShuffle from 'array-shuffle';

import { Card } from './Card.js';
// import Joker from "./Joker.js";
import { Rank, Suit } from './enums.js';

// const JOKERS_PER_DECK = 2;
const DECK_MULTIPLIER = 2;

export function generate() {
  const cards = [];

  for (let deck = 0; deck < DECK_MULTIPLIER; deck++) {
    for (const suit of [Suit.Club, Suit.Diamond, Suit.Heart, Suit.Spade]) {
      for (const rank of [
        Rank.Ace,
        Rank.N2,
        Rank.N3,
        Rank.N4,
        Rank.N5,
        Rank.N6,
        Rank.N7,
        Rank.N8,
        Rank.N9,
        Rank.N10,
        Rank.Jack,
        Rank.Queen,
        Rank.King,
      ]) {
        cards.push(new Card(suit, rank));
      }
    }
  }

  return arrayShuffle(cards);
}

// export function addJokers(cards: Card[]) {
//   for (let i = 0; i < DECK_MULTIPLIER; i++) {
//     for (let j = 0; j < JOKERS_PER_DECK; j++) {
//       cards.push(new Joker());
//     }
//   }

//   return arrayShuffle(cards);
// }
