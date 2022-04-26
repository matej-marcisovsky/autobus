import { generate, addJokers } from "../dist/game/Deck.js";

let deck = null;

describe('Deck', () => {
  it('should generate new deck', () => {
    deck = generate();

    expect(deck.length).toBe(104);
  });

  it('should add jokers to deck', () => {
    deck = addJokers(deck);

    expect(deck.length).toBe(108);
  });
});
