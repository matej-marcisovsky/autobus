import classNames from 'classnames';
import { memo, useCallback, useContext, useState, type DragEvent } from 'react';

import { CardComponent } from './CardComponent.js';
import { CounterComponent } from './CounterComponent.js';
import { Card } from '../../game/Card.js';
import { GameActionType } from '../GameActionType.js';
import { GameContext } from '../GameContext.js';

type Props = {
  cards: Card[];
  isDraggable: boolean;
  isDroppable: boolean;
};

function StockComponent({ cards, isDraggable, isDroppable }: Props) {
  const context = useContext(GameContext);

  const [highlight, setHighlight] = useState(false);

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!context?.isPlayersTurn() || !isDroppable) {
        event.dataTransfer.dropEffect = 'none';
        if (highlight) {
          setHighlight(false);
        }

        return;
      }

      event.dataTransfer.dropEffect = 'move';

      if (!highlight) {
        setHighlight(true);
      }
    },
    [context, highlight, isDroppable],
  );

  const onDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (highlight) {
        setHighlight(false);
      }
    },
    [highlight],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!context?.isPlayersTurn()) {
        return;
      }

      if (highlight) {
        setHighlight(false);
      }

      try {
        const { suit, rank, isJoker } = JSON.parse(
          event.dataTransfer.getData('card'),
        );

        context.emit(
          GameActionType.MoveCardToStock,
          new Card(suit, rank, isJoker),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [context, highlight],
  );

  return (
    <div
      className={classNames('stock is-relative is-flex-shrink-0', {
        'is-highlighted': highlight,
      })}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragLeave}
      onDrop={onDrop}
    >
      <CardComponent card={cards[0]} inStock isDraggable={isDraggable} />
      <CounterComponent>{cards.length}</CounterComponent>
    </div>
  );
}

const MemoizedStockComponent = memo(StockComponent);

export { MemoizedStockComponent as StockComponent };
