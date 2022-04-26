import * as React from "react";

import Card from "../game/Card.js";
import Origin from "../game/Origin.js";

import CardComponent from "./CardComponent.js";

interface Props {
  straights: Array<Card[]>,
  onMoveCardToStraight: Function
}

export default class extends React.Component<Props> {
  render() {
    const { straights } = this.props;

    return (
      <div
        className="is-flex-grow-1 is-flex"
        onDragOver={(event) => this.onDragOver(event)}
        onDrop={(event) => this.onDrop(event)}>
        {straights.map((straight, index) => this.renderStraight(straight, index))}
      </div>
    );
  }

  private renderStraight(straight: Card[], index: number) {
    return (
      <div key={index} className="straight mr-2" data-index={index}>
        <CardComponent card={straight[straight.length - 1]} isDroppable={true} inPile={false} inStock={false} hideFace={false}/>
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';
  }

  onDrop(event) {
    try {
      const { target } = event;
      const { onMoveCardToStraight } = this.props;
      const { color, suit, rank } = JSON.parse(event.dataTransfer.getData('card'));
      let straightIndex = null;
      let origin = Origin.Hand;

      if (target.classList.contains('card') && target.parentElement.classList.contains('straight')) {
        straightIndex = target.parentElement.dataset.index;
      }

      if (event.dataTransfer.getData('inpile')) {
        origin = Origin.Pile;
      }

      if (event.dataTransfer.getData('instock')) {
        origin = Origin.Stock;
      }

      onMoveCardToStraight(new Card(suit, rank, color), origin, straightIndex);
    } catch (error) {
      console.error(error);
    }
  }
}
