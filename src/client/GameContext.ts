import { createContext } from 'react';

interface GameContextInterface {
  currentPlayer: Function;
  emit: Function;
  isPlayersTurn: Function;
  on: Function;
  off: Function;
}

export const GameContext = createContext<GameContextInterface | null>(null);
