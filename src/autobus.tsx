import * as React from "react";
import * as ReactDOMClient from "react-dom/client";

import Game from "./game/Game.js";

import GameComponent from "./component/GameComponent.js";

const container = document.getElementById('game');
const game = new Game(0, 2);

const root = ReactDOMClient.createRoot(container);
root.render(<GameComponent game={game} />); 
