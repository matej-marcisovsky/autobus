import { createContext } from 'react';

interface GameContextInterface {
  currentPlayer: Function;
  emit: (eventName: string, eventData?: any) => void;
  isPlayersTurn: Function;
  on: (eventName: string, listener: (eventData: any) => void) => () => void;
}

export const GameContext = createContext<GameContextInterface | null>(null);
