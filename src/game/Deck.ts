import arrayShuffle from "array-shuffle";

import Card from "./Card.js";
// import Joker from "./Joker.js";
import Rank from "./Rank.js";
import Suit from "./Suit.js";

const JOKERS_PER_DECK = 2;
const DECK_MULTIPLIER = 2;

export function generate() {
  const cards = [];

  for (let deck = 0; deck < DECK_MULTIPLIER; deck++) {
    for (const suit in Suit) {
      for (const rank in Rank) {
        cards.push(new Card(
          Suit[suit],
          Rank[rank]
        ));
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
