import Card from "../dist/game/Card.js";
import Color from "../dist/game/Color.js";
import Player from "../dist/game/Player.js";
import Rank from "../dist/game/Rank.js";
import Suit from "../dist/game/Suit.js";

const STOCK = [
  new Card(Suit.Club, Rank.Ace, Color.Black),
  new Card(Suit.Club, Rank.N2, Color.Black),
  new Card(Suit.Club, Rank.N3, Color.Black),
  new Card(Suit.Club, Rank.N4, Color.Black),
  new Card(Suit.Club, Rank.N5, Color.Black),
  new Card(Suit.Club, Rank.N6, Color.Black),
  new Card(Suit.Club, Rank.N7, Color.Black),
  new Card(Suit.Club, Rank.N8, Color.Black),
  new Card(Suit.Club, Rank.N9, Color.Black),
  new Card(Suit.Club, Rank.N10, Color.Black)
];

const HAND = [
  new Card(Suit.Diamond, Rank.Ace, Color.Black),
  new Card(Suit.Diamond, Rank.N2, Color.Black),
  new Card(Suit.Diamond, Rank.N3, Color.Black),
  new Card(Suit.Diamond, Rank.N4, Color.Black),
  new Card(Suit.Diamond, Rank.N5, Color.Black)
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
      player.moveCardToPile(new Card(Suit.Diamond, Rank.Ace, Color.Black));
    };

    expect(t).toThrow();
  });

  it('should not move card to stock', () => {
    const t = () => {
      player.moveCardToStock(new Card(Suit.Diamond, Rank.Ace, Color.Black));
    };

    expect(t).toThrow();
  });
});
