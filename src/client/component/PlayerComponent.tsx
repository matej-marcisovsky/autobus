import classNames from 'classnames';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
  type DragEvent,
} from 'react';

import { CardComponent } from './CardComponent.js';
import { CounterComponent } from './CounterComponent.js';
import { DelimiterComponent } from './DelimiterComponent.js';
import { StockComponent } from './StockComponent.js';
import { Card } from '../../game/Card.js';
import { Origin } from '../../game/enums.js';
import { PLAYER_HAND_CARD_COUNT } from '../../game/Game.js';
import type { Player } from '../../game/Player.js';
import { GameActionType } from '../GameActionType.js';
import { GameContext } from '../GameContext.js';

type Props = {
  isEnemy?: boolean;
  player: Player;
};

function PlayerComponent({ isEnemy, player }: Props) {
  const context = useContext(GameContext);

  const [highlight, setHighlight] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribeMoveCardToStock = context?.on(
      GameActionType.MoveCardToStock,
      (card: Card) => {
        if (!context?.isPlayersTurn() || isEnemy) {
          return;
        }

        try {
          player.moveCardToOrigin(
            player.findCardInOrigin(card, Origin.Hand) as Card,
            Origin.Stock,
          );
          context.emit(GameActionType.EndTurn);
        } catch (error) {
          console.error(error);
        }
      },
    );

    return () => {
      unsubscribeMoveCardToStock!();
    };
  }, [context, isEnemy, player]);

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (isEnemy || !context?.isPlayersTurn()) {
        event.dataTransfer.dropEffect = 'none';

        if (highlight !== null) {
          setHighlight(null);
        }

        return;
      }

      try {
        if (event.dataTransfer.types.includes('inpile')) {
          event.dataTransfer.dropEffect = 'none';

          if (highlight !== null) {
            setHighlight(null);
          }

          return;
        }
      } catch (error) {
        console.error(error);
      }

      event.dataTransfer.dropEffect = 'move';

      if (highlight === null) {
        setHighlight(parseInt(event.currentTarget.dataset.index as string));
      }
    },
    [context, highlight, isEnemy],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (isEnemy || !context?.isPlayersTurn()) {
        return;
      }

      if (highlight !== null) {
        setHighlight(null);
      }

      try {
        const { suit, rank } = JSON.parse(event.dataTransfer.getData('card'));

        player.moveCardToOrigin(
          player.findCardInOrigin(new Card(suit, rank), Origin.Hand) as Card,
          Origin.Pile,
        );
        context?.emit(GameActionType.EndTurn);
      } catch (error) {
        console.error(error);
      }
    },
    [context, highlight, isEnemy, player],
  );

  const onDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (highlight !== null) {
        setHighlight(null);
      }
    },
    [highlight],
  );

  if (!player) {
    return null;
  }

  const currentPlayer = context?.currentPlayer();

  return (
    <div className='container block is-flex is-flex-direction-column player'>
      <div className='is-flex'>
        <StockComponent
          cards={player.stock}
          isDraggable={!isEnemy && context?.isPlayersTurn()}
          isDroppable={!isEnemy}
        />
        <DelimiterComponent
          highlight={currentPlayer && currentPlayer.id === player.id}
        />
        <div className='piles is-flex'>
          {player.piles.map((pile, index) => (
            <div
              key={index}
              className={classNames('pile card mr-2', {
                'is-highlighted': highlight === index,
              })}
              data-index={index}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragLeave={onDragLeave}
            >
              {!!pile.length && (
                <CardComponent
                  card={pile[0]}
                  isDraggable={!isEnemy && context?.isPlayersTurn()}
                  inPile
                />
              )}
              <CounterComponent>{pile.length}</CounterComponent>
            </div>
          ))}
        </div>
      </div>
      {!isEnemy && (
        <div className='hand is-flex is-justify-content-center mt-6'>
          {[...Array(PLAYER_HAND_CARD_COUNT)].map((_, index) => {
            const card = player.hand[index];

            if (!card) {
              return <div key={index} className='card' />;
            }

            return (
              <CardComponent
                key={index}
                card={card}
                isDraggable={context?.isPlayersTurn()}
                inHand
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const MemoizedPlayerComponent = memo(PlayerComponent);

export { MemoizedPlayerComponent as PlayerComponent };
