import * as React from "react";

import Card from "../game/Card.js";

import CounterComponent from "./CounterComponent.js";
import CardComponent from "./CardComponent.js";

interface Props {
  cards: Card[],
  hideFace: boolean,
  isDroppable: boolean,
  onMoveCardToStock: Function
}

export default class extends React.Component<Props> {
  render() {
    const { cards, hideFace, isDroppable } = this.props;

    return (
      <div
        className="stock is-relative is-flex-shrink-0"
        onDragOver={(event) => this.onDragOver(event)}
        onDrop={(event) => this.onDrop(event)}>
        <CardComponent card={cards[0]} inPile={false} inStock={true} isDroppable={isDroppable} hideFace={hideFace}/>
        {isDroppable && <CounterComponent>{cards.length}</CounterComponent>}
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    if (this.props.isDroppable) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event) {
    try {
      const { onMoveCardToStock } = this.props;
      const { color, suit, rank } = JSON.parse(event.dataTransfer.getData('card'));

      onMoveCardToStock(new Card(suit, rank, color));
    } catch (error) {
      console.error(error);
    }
  }
}
