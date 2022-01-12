import Card from "../dist/Card.js";
import Player from "../dist/Player.js";
import Rank from "../dist/Rank.js";
import Suit from "../dist/Suit.js";

const STOCK = [
  new Card(Suit.Club, Rank.Ace),
  new Card(Suit.Club, Rank.N2),
  new Card(Suit.Club, Rank.N3),
  new Card(Suit.Club, Rank.N4),
  new Card(Suit.Club, Rank.N5),
  new Card(Suit.Club, Rank.N6),
  new Card(Suit.Club, Rank.N7),
  new Card(Suit.Club, Rank.N8),
  new Card(Suit.Club, Rank.N9),
  new Card(Suit.Club, Rank.N10)
];

const HAND = [
  new Card(Suit.Diamond, Rank.Ace),
  new Card(Suit.Diamond, Rank.N2),
  new Card(Suit.Diamond, Rank.N3),
  new Card(Suit.Diamond, Rank.N4),
  new Card(Suit.Diamond, Rank.N5)
];

let player = null;

beforeEach(() => {
  player = new Player(0, STOCK.slice(), HAND.slice());
});

describe('Player', () => {
  it('should move card to pile', () => {
    player.moveCardToPile(player.hand[0]);

    expect(player.hand.length).toBe(HAND.length - 1);
    expect(player.piles[0].length).toBe(1);
  });

  it('should move card to stock', () => {
    player.moveCardToStock(player.hand[0]);

    expect(player.hand.length).toBe(HAND.length - 1);
    expect(player.stock.length).toBe(STOCK.length + 1);
  });

  it('should not move card to pile', () => {
    const t = () => {
      player.moveCardToPile(new Card(Suit.Diamond, Rank.Ace));
    };

    expect(t).toThrow();
  });

  it('should not move card to stock', () => {
    const t = () => {
      player.moveCardToStock(new Card(Suit.Diamond, Rank.Ace));
    };

    expect(t).toThrow();
  });
});
