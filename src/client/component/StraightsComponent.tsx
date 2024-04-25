import classNames from 'classnames';
import { memo, useCallback, useContext, useState, type DragEvent } from 'react';

import { CardComponent } from './CardComponent.js';
import { Card } from '../../game/Card.js';
import { Origin } from '../../game/enums.js';
import { GameActionType } from '../GameActionType.js';
import { GameContext } from '../GameContext.js';

const MAX_PARENT_DEPTH = 3;

type Props = {
  straights: Card[][];
};

function StraightsComponent({ straights }: Props) {
  const context = useContext(GameContext);

  const [highlight, setHighlight] = useState<number | null>(null);

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!context?.isPlayersTurn()) {
        event.dataTransfer.dropEffect = 'none';

        if (highlight !== null) {
          setHighlight(null);
        }
      } else {
        event.dataTransfer.dropEffect = 'move';

        try {
          let straightIndex = null;

          let target = event.target as HTMLDivElement;
          for (let i = 0; i < MAX_PARENT_DEPTH; i++) {
            if (
              target.classList.contains('card') &&
              target.parentElement?.classList.contains('straight')
            ) {
              straightIndex = parseInt(
                target.parentElement.dataset.index as string,
              );
              break;
            }

            target = target.parentElement as HTMLDivElement;
          }

          if (straightIndex !== null && straightIndex !== highlight) {
            setHighlight(straightIndex);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [context, highlight],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!context?.isPlayersTurn()) {
        return;
      }

      if (highlight !== null) {
        setHighlight(null);
      }

      try {
        const { suit, rank, isJoker } = JSON.parse(
          event.dataTransfer.getData('card'),
        );
        let straightIndex = null;
        let origin = Origin.Hand;

        let target = event.target as HTMLDivElement;
        for (let i = 0; i < MAX_PARENT_DEPTH; i++) {
          if (
            target.classList.contains('card') &&
            target.parentElement?.classList.contains('straight')
          ) {
            straightIndex = target.parentElement.dataset.index;
            break;
          }

          target = target.parentElement as HTMLDivElement;
        }

        if (event.dataTransfer.getData('inpile')) {
          origin = Origin.Pile;
        }

        if (event.dataTransfer.getData('instock')) {
          origin = Origin.Stock;
        }

        context.emit(GameActionType.MoveCardToStraight, {
          card: new Card(suit, rank, isJoker),
          origin,
          straightIndex,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [context, highlight],
  );

  const onDragLeave = useCallback(() => {
    if (highlight !== null) {
      setHighlight(null);
    }
  }, [highlight]);

  return (
    <div
      className='is-flex-grow-1 is-flex'
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      {straights.map((straight, index) => (
        <div
          key={index}
          className={classNames('straight mr-2', {
            'is-highlighted': highlight === index,
          })}
          data-index={index}
        >
          <CardComponent card={straight[straight.length - 1]} />
        </div>
      ))}
    </div>
  );
}

const MemoizedStraightsComponent = memo(StraightsComponent);

export { MemoizedStraightsComponent as StraightsComponent };
