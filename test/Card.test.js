import Card from "../dist/game/Card.js";
import Color from "../dist/game/Color.js";
import Rank from "../dist/game/Rank.js";
import Suit from "../dist/game/Suit.js";

describe('Card', () => {
  it('should decide rank order', () => {
    const card1 = new Card(Suit.Club, Rank.Ace, Color.Black);
    const card2 = new Card(Suit.Club, Rank.N2, Color.Black);

    expect(card2.isNextRankOf(card1)).toBe(true);
    expect(card1.isNextRankOf(card2)).toBe(false);
  });
});
