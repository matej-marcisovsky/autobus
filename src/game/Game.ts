import arrayShuffle from 'array-shuffle';
import type { Jsonify } from 'type-fest';

import { Card } from './Card.js';
import { generate } from './Deck.js';
import { Rank, type Origin, type Suit } from './enums.js';
import { InvalidGameMove, UnknownPlayer } from './Errors.js';
import { Player, ERROR_CARD_NOT_IN_ORIGIN } from './Player.js';

const MAX_AGE = 1000 * 60 * 60;
const PLAYER_STOCK_CARD_COUNT = 15;

export const PLAYER_HAND_CARD_COUNT = 5;

const ERROR_HAND_FULL = 'Hand is full.';
const ERROR_NO_STRAIGHT = 'No straight available.';
const ERROR_NEXT_RANK =
  'This card is not in order with last card in straight..';

export class Game {
  currentPlayer?: Player;
  id: string;
  lastActionTime: number = Date.now();
  players: Player[] = [];
  stock: Card[] = [];
  straights: Array<Card[]> = [];

  static deserialize(data: Jsonify<Game>): Game {
    const { currentPlayer, id, stock, players, straights } = data;

    if (!id || !stock || !players || !straights) {
      throw new Error('Invalid serialized data.');
    }

    const _stock: Card[] = [],
      _players: Player[] = [],
      _straights: Card[][] = [];

    stock.forEach(card => {
      _stock.push(new Card(card.suit as Suit, card.rank as Rank, card.isJoker));
    });

    players.forEach(player => {
      const playerStock: Card[] = [];
      player.stock.forEach(card => {
        playerStock.push(
          new Card(card.suit as Suit, card.rank as Rank, card.isJoker),
        );
      });

      const playerHand: Card[] = [];
      player.hand.forEach(card => {
        playerHand.push(
          new Card(card.suit as Suit, card.rank as Rank, card.isJoker),
        );
      });

      const playerPiles: Card[][] = [];
      player.piles.forEach(pile => {
        const playerPile: Card[] = [];

        pile.forEach(card => {
          playerPile.push(
            new Card(card.suit as Suit, card.rank as Rank, card.isJoker),
          );
        });

        playerPiles.push(playerPile);
      });

      _players.push(
        new Player(
          player.id,
          playerStock,
          playerHand,
          playerPiles,
          player.hasUser,
        ),
      );
    });

    straights.forEach(straight => {
      const _straight: Card[] = [];

      straight.forEach(card => {
        _straight.push(
          new Card(card.suit as Suit, card.rank as Rank, card.isJoker),
        );
      });

      _straights.push(_straight);
    });

    const game = new Game(id, players.length, _stock, _players, _straights);

    game.currentPlayer = game.players.find(
      player => player.id === currentPlayer?.id,
    );

    return game;
  }

  get isOld(): boolean {
    return Date.now() - this.lastActionTime > MAX_AGE;
  }

  constructor(
    id: string,
    playerCount: number,
    stock?: Card[],
    players?: Player[],
    straights?: Card[][],
  ) {
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
    const player = this.players.find(_player => _player === this.currentPlayer);

    if (!player) {
      throw new UnknownPlayer();
    }

    const playerHandLength = player.hand.length;

    if (playerHandLength >= PLAYER_HAND_CARD_COUNT) {
      throw new InvalidGameMove(ERROR_HAND_FULL);
    }

    // TODO Handle jokers

    player.hand.splice(
      playerHandLength,
      0,
      ...this.stock.splice(0, PLAYER_HAND_CARD_COUNT - playerHandLength),
    );
  }

  private initPlayers(playerCount: number) {
    for (let index = 0; index < playerCount; index++) {
      this.players.push(
        new Player(
          index,
          this.stock.splice(0, PLAYER_STOCK_CARD_COUNT),
          this.stock.splice(0, PLAYER_HAND_CARD_COUNT),
        ),
      );
    }
  }

  private switchToNextPlayer() {
    if (!this.currentPlayer) {
      throw new UnknownPlayer();
    }

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

  moveCardToStraight(card: Card, origin: Origin, straight?: Card[]) {
    if (!this.currentPlayer) {
      throw new UnknownPlayer();
    }

    if (!this.currentPlayer.isCardInOrigin(card, origin)) {
      throw new InvalidGameMove(ERROR_CARD_NOT_IN_ORIGIN);
    }

    // Starting new straight.
    if ((card.rank === Rank.Ace || card.isUnusedJoker) && !straight) {
      this.straights.push([card]);
      this.currentPlayer.removeCardFromOrigin(card, origin);

      card.rank = Rank.Ace;

      if (!this.currentPlayer.hand.length) {
        this.drawCards();
      }

      return;
    }

    if (!straight?.length) {
      throw new InvalidGameMove(ERROR_NO_STRAIGHT);
    }

    const topCard = straight[straight.length - 1];
    if (card.isNextRankOf(topCard)) {
      straight.push(card);
      this.currentPlayer.removeCardFromOrigin(card, origin);

      card.rank = topCard.nextRank;

      if (!this.currentPlayer.hand.length) {
        this.drawCards();
      }

      if (card.rank === Rank.King) {
        this.stock.push(...arrayShuffle(straight));
        this.straights.splice(
          this.straights.findIndex(_straight => straight === _straight),
          1,
        );
      }
    } else {
      throw new InvalidGameMove(ERROR_NEXT_RANK);
    }
  }
}
