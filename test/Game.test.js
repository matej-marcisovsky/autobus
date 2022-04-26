import Game from "../dist/game/Game.js";

let game = null;

beforeEach(() => {
  game = new Game(0, 2);
});

describe('Game', () => {
  it('should start new game', () => {
    expect(game.stock.length).toBe(68);
    expect(game.players.length).toBe(2);
    expect(game.currentPlayer).toEqual(game.players[0]);
  });

  it('should draw cards to current player and switch to next player', () => {
    const currentPlayer = game.currentPlayer;

    currentPlayer.moveCardToPile(currentPlayer.hand[0]);
    game.endTurn();

    expect(game.stock.length).toBe(67);
    expect(game.currentPlayer).not.toEqual(currentPlayer);
    expect(game.currentPlayer).toEqual(game.players[1]);
  });

  it('should switch to first player if no other players left', () => {
    game.currentPlayer.moveCardToPile(game.currentPlayer.hand[0]);
    game.endTurn();
    game.currentPlayer.moveCardToPile(game.currentPlayer.hand[0]);
    game.endTurn();

    expect(game.currentPlayer).toEqual(game.players[0]);
  });
});
