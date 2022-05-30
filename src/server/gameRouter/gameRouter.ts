import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from "uuid";

import ActionType from '../../ActionType.js';
import Message from "../../Message.js";
import Game from "../../game/Game.js";

const PLAYER_COUNT = 2;
const ACTIONS = Object.freeze({
  [ActionType.JoinGame]: joinGame,
  [ActionType.NewGame]: newGame,
  [ActionType.UpdateGame]: updateGame
});

const games: Map<string, Game> = new Map();

export default (server) => {
  const wss = new WebSocketServer({
    server,
    path: '/game'
  });

  setInterval(() => {
    wss.clients.forEach((client) => {
      client.ping();
    });
  }, 2000);

  wss.on('connection', function connection(ws) {
    ws.on('pong', () => {
      const { id } = ws;

      if (id && games.has(id)) {
        const game = games.get(id);

        game.lastActionTime = Date.now();
      }
    });

    ws.on('message', (message) => {
      message = Message.fromBuffer(message);

      if (message.action === ActionType.NewGame) {
        for (const [id, game] of games) {
          if (game.isOld) {
            games.delete(id);

            wss.clients.forEach((client) => {
              if (client.id === id) {
                ws.terminate()
              }
            });
          }
        }
      }

      if (ACTIONS[message.action]) {
        const id = message?.data?.id;

        if (id && games.has(id)) {
          const game = games.get(id);

          game.lastActionTime = Date.now();
        }

        const _message = ACTIONS[message.action](message, wss);

        if (!ws.id) {
          ws.id = _message?.game?.id;
        }

        if (message.action === ActionType.UpdateGame) {
          return wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.id === _message.game.id) {
              client.send(`${_message}`);
            }
          });
        }

        return ws.send(`${_message}`);
      }

      return ws.send(`${Message.error(ActionType.Error, 405)}`);
    });
  });
};

function joinGame(message: Message): Message {
  const { data } = message;

  if (!games.has(data.id)) {
    return Message.error(ActionType.Error, 404);
  }

  const game = games.get(data.id);

  const nextFreePlayer = game.players.find((player) => !player.hasUser);

  if (!nextFreePlayer) {
    return Message.error(ActionType.Error, 400);
  }

  nextFreePlayer.hasUser = true;

  return new Message(
    ActionType.JoinGame,
    200,
    {
      playerId: nextFreePlayer.id
    },
    game
  );
}

function newGame(message: Message): Message {
  const gameId = uuidv4();
  const game = new Game(gameId, PLAYER_COUNT);

  games.set(gameId, game);

  return new Message(
    ActionType.NewGame,
    200,
    {
      playerId: 0
    },
    game
  );
}

function updateGame(message: Message) {
  const { game } = message;

  if (!games.has(game.id)) {
    return Message.error(ActionType.Error, 404);
  }

  games.set(game.id, Game.deserialize(game));

  const _game = games.get(game.id);

  return new Message(ActionType.UpdateGame, 200, null, _game);
}
