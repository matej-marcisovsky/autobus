import * as React from "react";

import Card from "../../game/Card.js";
import GameActionType from "../GameActionType.js";
import GameContext from "../GameContext.js";
import Origin from "../../game/Origin.js";

import CardComponent from "./CardComponent.js";

interface Props {
  straights: Array<Card[]>
}

export default class extends React.Component<Props> {
  static contextType: React.Context<any> = GameContext;

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
        <CardComponent card={straight[straight.length - 1]} isDraggable={false} isDroppable={true} inPile={false} inStock={false}/>
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    if (!this.context.isPlayersTurn()) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    event.dataTransfer.dropEffect = 'move';
  }

  onDrop(event) {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    try {
      const { target } = event;
      const { suit, rank } = JSON.parse(event.dataTransfer.getData('card'));
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

      this.context.emit(GameActionType.MoveCardToStraight, { card: new Card(suit, rank), origin, straightIndex });
    } catch (error) {
      console.error(error);
    }
  }
}
