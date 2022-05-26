import arrayShuffle from "array-shuffle";

import Card from "./Card.js";
import { generate } from "./Deck.js";
import Player, { ERROR_CARD_NOT_IN_ORIGIN } from "./Player.js";
import { InvalidGameMove, UnknownPlayer } from "./Errors.js";
import Rank from "./Rank.js";
import Joker from "./Joker.js";
import Origin from "./Origin.js";
import Suit from "./Suit.js";
import Color from "./Color.js";

const MAX_AGE = 1000 * 60 * 60;
const PLAYER_STOCK_CARD_COUNT = 15;
export const PLAYER_HAND_CARD_COUNT = 5;

const ERROR_HAND_FULL = 'Hand is full.';
const ERROR_NO_STRAIGHT = 'No straight available.';
const ERROR_NEXT_RANK = 'This card is not in order with last card in straight..';

export default class Game {
  currentPlayer: Player;
  id: string;
  lastActionTime: number = Date.now()
  players: Player[] = [];
  stock: Card[] = [];
  straights: Array<Card[]> = [];

  static deserialize(data): Game {
    const { currentPlayer, id, stock, players, straights } = data

    if (!id || !stock || !players || !straights) {
      throw new Error('Invalid serialized data.');
    }

    const _stock = [], _players = [], _straights = [];

    stock.forEach(card => {
      _stock.push(new Card(card.suit as Suit, card.rank as Rank, card.color as Color));
    });

    players.forEach(player => {
      const playerStock = [];
      player.stock.forEach(card => {
        playerStock.push(new Card(card.suit as Suit, card.rank as Rank, card.color as Color));
      });

      const playerHand = [];
      player.hand.forEach(card => {
        playerHand.push(new Card(card.suit as Suit, card.rank as Rank, card.color as Color));
      });

      const playerPiles = [];
      player.piles.forEach(pile => {
        const playerPile = [];

        pile.forEach(card => {
          playerPile.push(new Card(card.suit as Suit, card.rank as Rank, card.color as Color));
        });

        playerPiles.push(playerPile);
      });

      _players.push(new Player(player.id, playerStock, playerHand, playerPiles, player.hasUser));
    });

    straights.forEach(straight => {
      const _straight = [];

      straight.forEach(card => {
        _straight.push(new Card(card.suit as Suit, card.rank as Rank, card.color as Color));
      });

      _straights.push(_straight);
    });

    const game = new Game(id, players.length, _stock, _players, _straights);

    game.currentPlayer = game.players.find((player) => player.id === currentPlayer.id);

    return game;
  }

  get isOld(): boolean {
    return Date.now() - this.lastActionTime > MAX_AGE;
  }

  constructor(id: string, playerCount: number, stock: Card[] = null, players: Player[] = null, straights: Array<Card[]> = null) {
    this.id = id;

    if (stock && players && straights) {
      this.stock = stock;
      this.players = players;
      this.straights = straights;
    } else {
      this.stock = generate();
      this.initPlayers(playerCount);

      this.currentPlayer = this.players[0];
      this.currentPlayer.hasUser = true;
    }
  }

  private drawCards() {
    const player = this.players.find((_player) => _player === this.currentPlayer);

    if (!player) {
      throw new UnknownPlayer();
    }

    const playerHandLength = player.hand.length;

    if (playerHandLength >= PLAYER_HAND_CARD_COUNT) {
      throw new InvalidGameMove(ERROR_HAND_FULL);
    }

    // TODO Handle jokers

    player.hand.splice(playerHandLength, 0, ...this.stock.splice(0, PLAYER_HAND_CARD_COUNT - playerHandLength));
  }

  private initPlayers(playerCount: number) {
    for (let index = 0; index < playerCount; index++) {
      this.players.push(new Player(index, this.stock.splice(0, PLAYER_STOCK_CARD_COUNT), this.stock.splice(0, PLAYER_HAND_CARD_COUNT)));
    }
  }

  private switchToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.currentPlayer);

    if (currentPlayerIndex === -1) {
      throw new UnknownPlayer();
    }

    let nextPlayerIndex = currentPlayerIndex + 1;

    if (nextPlayerIndex === this.players.length) {
      nextPlayerIndex = 0;
    }

    this.currentPlayer = this.players[nextPlayerIndex];
  }

  endTurn() {
    this.drawCards();
    this.switchToNextPlayer();
  }

  moveCardToStraight(card: Card, origin: Origin, straight: Card[] = null) {
    if (!this.currentPlayer.isCardInOrigin(card, origin)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_ORIGIN);
    }

    // Starting new straight.
    if ((card.rank === Rank.Ace || card instanceof Joker) && !straight) {
      this.straights.push([card]);
      this.currentPlayer.removeCardFromOrigin(card, origin);

      return;
    }

    if (!straight || !straight.length) {
      throw new InvalidGameMove(ERROR_NO_STRAIGHT);
    }

    if (card.isNextRankOf(straight[straight.length - 1])) {
      straight.push(card);
      this.currentPlayer.removeCardFromOrigin(card, origin);

      if (card.rank === Rank.King) {
        this.stock.push(...arrayShuffle(straight));
        this.straights.splice(this.straights.findIndex(_straight => straight === _straight), 1);
      }
    } else {
      throw new InvalidGameMove(ERROR_NEXT_RANK);
    }
  }
}
