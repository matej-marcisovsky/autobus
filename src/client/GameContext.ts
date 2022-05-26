import * as React from "react";

interface GameContextInterface {
  emit: Function,
  isPlayersTurn: Function
  on: Function,
}

export default React.createContext<GameContextInterface | null>(null);
