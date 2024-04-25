import { memo, useContext, useEffect, useState } from 'react';

import { PlayerComponent } from './PlayerComponent.js';
import { StraightsComponent } from './StraightsComponent.js';
import { ActionType } from '../../ActionType.js';
import type { Card } from '../../game/Card.js';
import type { Origin } from '../../game/enums.js';
import type { Game } from '../../game/Game.js';
import { GameActionType } from '../GameActionType.js';
import { GameContext } from '../GameContext.js';

type Props = {
  game: Game;
  playerId: number;
};

function GameComponent({ game, playerId }: Props) {
  const context = useContext(GameContext);

  const [key, forceUpdate] = useState(0);

  useEffect(() => {
    context?.on(GameActionType.EndTurn, () => {
      if (!context?.isPlayersTurn()) {
        return;
      }

      try {
        game.endTurn();
        context?.emit(ActionType.UpdateGame);
        forceUpdate(key + 1);
      } catch (error) {
        console.error(error);
      }
    });

    context?.on(
      GameActionType.MoveCardToStraight,
      ({
        card,
        origin,
        straightIndex,
      }: {
        card: Card;
        origin: Origin;
        straightIndex: number;
      }) => {
        if (!context?.isPlayersTurn()) {
          return;
        }

        let straight: Card[] | undefined;

        if (straightIndex !== null) {
          straight = game.straights[straightIndex];
        }

        try {
          game.moveCardToStraight(
            game.currentPlayer?.findCardInOrigin(card, origin) as Card,
            origin,
            straight,
          );

          context?.emit(ActionType.UpdateGame);
          forceUpdate(key + 1);
        } catch (error) {
          console.error(error);
        }
      },
    );
  }, [context, game, key]);

  if (!game) {
    return null;
  }

  // TODO more enemy players
  return (
    <div
      key={key}
      className='is-flex is-justify-content-center is-flex-direction-column'
    >
      <PlayerComponent player={game.players[playerId === 0 ? 1 : 0]} isEnemy />
      <div className='container block is-flex is-flex-direction-row app--middle'>
        <StraightsComponent straights={game.straights} />
      </div>
      <PlayerComponent player={game.players[playerId]} />
    </div>
  );
}

const MemoizedGameComponent = memo(GameComponent);

export { MemoizedGameComponent as GameComponent };
