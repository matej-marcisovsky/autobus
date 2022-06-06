import * as React from "react";
import classNames from "classnames";

import GameActionType from "../GameActionType.js";
import GameContext from "../GameContext.js";
import Card from "../../game/Card.js";

import CounterComponent from "./CounterComponent.js";
import CardComponent from "./CardComponent.js";

interface Props {
  cards: Card[],
  isDraggable: boolean,
  isDroppable: boolean
}

interface State {
  highlight: boolean;
}

export default class extends React.Component<Props, State> {
  static contextType: React.Context<any> = GameContext;

  constructor(props) {
    super(props);

    this.state = {
      highlight: false
    };
  }

  render() {
    const { cards, isDraggable } = this.props;

    return (
      <div
        className={classNames('stock is-relative is-flex-shrink-0', {
          'is-highlighted': this.state.highlight
        })}
        onDragOver={(event) => this.onDragOver(event)}
        onDragLeave={() => this.onDragLeave()}
        onDragEnd={() => this.onDragLeave()}
        onDrop={(event) => this.onDrop(event)}>
        <CardComponent card={cards[0]} inStock={true} isDraggable={isDraggable}/>
        <CounterComponent>{cards.length}</CounterComponent>
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    if (!this.context.isPlayersTurn() || !this.props.isDroppable) {
      event.dataTransfer.dropEffect = 'none';
      if (this.state.highlight) {
        this.setState({
          highlight: false
        });
      }
      return;
    }

    event.dataTransfer.dropEffect = 'move';

    if (!this.state.highlight) {
      this.setState({
        highlight: true
      });
    }
  }

  onDragLeave() {
    if (this.state.highlight) {
      this.setState({
        highlight: false
      });
    }
  }

  onDrop(event) {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    if (this.state.highlight) {
      this.setState({
        highlight: false
      });
    }

    try {
      const { suit, rank } = JSON.parse(event.dataTransfer.getData('card'));

      this.context.emit(GameActionType.MoveCardToStock, new Card(suit, rank));
    } catch (error) {
      console.error(error);
    }
  }
}
