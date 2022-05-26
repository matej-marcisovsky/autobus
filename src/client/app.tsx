import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import ActionType from "../ActionType.js";
import Emittery from "emittery";

import Game from "../game/Game.js";
import GameContext from "./GameContext.js";
import Message from "../Message.js";

import AppComponent from "./component/AppComponent.js";
import GameActionType from "./GameActionType.js";

const emitter = new Emittery();
const container = document.getElementById('app');
const ws = new WebSocket(`ws://${window.location.host}/game`);

let game = null;
let playerId = null;

ws.onerror = (event) => console.log(event); // TODO Better error handling.

ws.onmessage = (event) => {
  const { action, game: deserializedGame, data, status } = JSON.parse(event.data);

  if (status !== 200) {
    emitter.emit(ActionType.Error, { action, status });

    return;
  }

  // New or joining game
  if (
    (
      action === ActionType.NewGame ||
      action === ActionType.JoinGame
    ) &&
    !game
  ) {
    game = Game.deserialize(deserializedGame);
    playerId = data.playerId

    if (action === ActionType.JoinGame) {
      ws.send(`${new Message(ActionType.UpdateGame, 200, null, game)}`);
    }

    emitter.emit(GameActionType.UpdateState, { game, playerId });

    return;
  }

  if (action === ActionType.UpdateGame) {
    game = Game.deserialize(deserializedGame);

    emitter.emit(GameActionType.UpdateState, { game, playerId });

    const winner = game.players.find((player) => !player.stock.length);

    if (winner) {
      emitter.emit(GameActionType.EndGame, winner);
    }
  }
};

emitter.on(ActionType.NewGame, () => ws.send(`${new Message(ActionType.NewGame)}`));
emitter.on(ActionType.JoinGame, (id) => ws.send(`${new Message(ActionType.JoinGame, 200, { id })}`));
emitter.on(ActionType.UpdateGame, () => ws.send(`${new Message(ActionType.UpdateGame, 200, null, game)}`));

const root = ReactDOMClient.createRoot(container);
root.render(
  <GameContext.Provider value={{
    emit: (eventName, data) => emitter.emit(eventName, data),
    isPlayersTurn: () => game && game.currentPlayer.id === playerId && !game.players.find((player) => !player.hasUser),
    on: (eventName, listener) => emitter.on(eventName, listener)
  }}>
    <AppComponent />
  </GameContext.Provider>
);
