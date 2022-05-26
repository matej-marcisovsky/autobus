import * as React from "react";

import GameActionType from "../GameActionType.js";
import GameContext from "../GameContext.js";
import Card from "../../game/Card.js";

import CounterComponent from "./CounterComponent.js";
import CardComponent from "./CardComponent.js";

interface Props {
  cards: Card[],
  hideFace: boolean,
  isDraggable: boolean,
  isDroppable: boolean
}

export default class extends React.Component<Props> {
  static contextType: React.Context<any> = GameContext;

  render() {
    const { cards, hideFace, isDraggable, isDroppable } = this.props;

    return (
      <div
        className="stock is-relative is-flex-shrink-0"
        onDragOver={(event) => this.onDragOver(event)}
        onDrop={(event) => this.onDrop(event)}>
        <CardComponent card={cards[0]} inPile={false} inStock={true} isDraggable={isDraggable} isDroppable={isDroppable} hideFace={hideFace}/>
        {isDroppable && <CounterComponent>{cards.length}</CounterComponent>}
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    if (!this.context.isPlayersTurn()) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    if (this.props.isDroppable) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event) {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    try {
      const { color, suit, rank } = JSON.parse(event.dataTransfer.getData('card'));

      this.context.emit(GameActionType.MoveCardToStock, new Card(suit, rank, color));
    } catch (error) {
      console.error(error);
    }
  }
}
