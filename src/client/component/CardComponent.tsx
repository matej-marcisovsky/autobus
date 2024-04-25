import classNames from 'classnames';
import { memo, useCallback, useEffect, useRef, type DragEvent } from 'react';

import type { Card } from '../../game/Card.js';
import { Color, Rank, Suit } from '../../game/enums.js';

type Props = {
  card: Card;
  isDraggable?: boolean;
  inHand?: boolean;
  inPile?: boolean;
  inStock?: boolean;
};

function getRankString(rank: Rank) {
  let code = [191];

  switch (rank) {
    case Rank.Ace:
      code = [65];
      break;
    case Rank.N2:
      code = [50];
      break;
    case Rank.N3:
      code = [51];
      break;
    case Rank.N4:
      code = [52];
      break;
    case Rank.N5:
      code = [53];
      break;
    case Rank.N6:
      code = [54];
      break;
    case Rank.N7:
      code = [55];
      break;
    case Rank.N8:
      code = [56];
      break;
    case Rank.N9:
      code = [57];
      break;
    case Rank.N10:
      code = [49, 48];
      break;
    case Rank.Jack:
      code = [74];
      break;
    case Rank.Queen:
      code = [81];
      break;
    case Rank.King:
      code = [75];
      break;
    case Rank.Joker:
      code = [191];
      break;
  }

  return String.fromCharCode(...code);
}

function getSuitString(suit: Suit) {
  let code = 191;

  switch (suit) {
    case Suit.Club:
      code = 9827;
      break;
    case Suit.Diamond:
      code = 9830;
      break;
    case Suit.Heart:
      code = 9829;
      break;
    case Suit.Spade:
      code = 9824;
      break;
  }

  return String.fromCharCode(code);
}

function CardComponent({ card, isDraggable, inHand, inPile, inStock }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const tempCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (tempCardRef.current) {
        tempCardRef.current.remove();
      }
    };
  }, []);

  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('card', JSON.stringify(card));
      event.dataTransfer.effectAllowed = 'move';

      if (tempCardRef.current) {
        tempCardRef.current.remove();
      }

      if (inPile) {
        event.dataTransfer.setData('inpile', JSON.stringify(true));
      } else if (inStock) {
        event.dataTransfer.setData('instock', JSON.stringify(true));
      } else if (inHand) {
        const { current: cardElm } = rootRef;

        if (!cardElm) {
          return;
        }

        tempCardRef.current = cardElm.cloneNode(true) as HTMLDivElement;
        tempCardRef.current.classList.add('playing-card--temp');

        document.body.appendChild(tempCardRef.current);

        event.dataTransfer.setDragImage(tempCardRef.current, 50, 50);
      }
    },
    [card, inHand, inPile, inStock],
  );

  const onDragEnd = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (tempCardRef.current) {
      tempCardRef.current.remove();
    }
  }, []);

  if (!card) {
    return null;
  }

  const { color, rank, suit, isJoker, isUnusedJoker } = card;

  return (
    <div
      ref={rootRef}
      className={classNames('card playing-card', {
        'is-clickable': isDraggable,
        'playing-card--red': color === Color.Red,
        'playing-card--is-joker': isJoker,
      })}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable={isDraggable}
    >
      <div className='playing-card__symbol is-flex is-flex-direction-column'>
        <span
          className={classNames({
            'playing-card__rank': true,
            'playing-card__rank--is-joker': isUnusedJoker,
          })}
        >
          {getRankString(rank)}
        </span>
        {!isJoker && (
          <span className='playing-card__suit'>{getSuitString(suit)}</span>
        )}
      </div>
      <div className='playing-card__symbol playing-card__symbol--bottom is-flex is-flex-direction-column'>
        <span className='playing-card__rank'>{getRankString(rank)}</span>
        {!isJoker && (
          <span className='playing-card__suit'>{getSuitString(suit)}</span>
        )}
      </div>
      {isJoker && <span className='playing-card__joker'>🂿</span>}
    </div>
  );
}

const MemoizedCardComponent = memo(CardComponent);

export { MemoizedCardComponent as CardComponent };
