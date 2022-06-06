import * as React from "react";
import classNames from "classnames";

import Card from "../../game/Card.js";
import GameActionType from "../GameActionType.js";
import GameContext from "../GameContext.js";
import Origin from "../../game/Origin.js";

import CardComponent from "./CardComponent.js";

const MAX_PARENT_DEPTH = 3;

interface Props {
  straights: Array<Card[]>
}

interface State {
  highlight?: number;
}

export default class extends React.Component<Props, State> {
  static contextType: React.Context<any> = GameContext;

  constructor(props) {
    super(props);

    this.state = {
      highlight: null
    };
  }

  render() {
    const { straights } = this.props;

    return (
      <div
        className="is-flex-grow-1 is-flex"
        onDragOver={(event) => this.onDragOver(event)}
        onDrop={(event) => this.onDrop(event)}
        onDragLeave={() => this.onDragLeave()}>
        {straights.map((straight, index) => this.renderStraight(straight, index))}
      </div>
    );
  }

  private renderStraight(straight: Card[], index: number) {
    return (
      <div
        key={index}
        className={classNames('straight mr-2', {
          'is-highlighted': this.state.highlight === index
        })}
        data-index={index}>
        <CardComponent card={straight[straight.length - 1]}/>
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    if (!this.context.isPlayersTurn()) {
      event.dataTransfer.dropEffect = 'none';

      if (this.state.highlight !== null) {
        this.setState({
          highlight: null
        });
      }
    } else {
      event.dataTransfer.dropEffect = 'move';

      try {
        let straightIndex = null;

        let target = event.target;
        for (let i = 0; i < MAX_PARENT_DEPTH; i++) {
          if (target.classList.contains('card') && target.parentElement.classList.contains('straight')) {
            straightIndex = parseInt(target.parentElement.dataset.index);
            break;
          }

          target = target.parentElement;
        }

        if (straightIndex !== null && straightIndex !== this.state.highlight) {
          this.setState({
            highlight: straightIndex
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  onDragLeave() {
    if (this.state.highlight !== null) {
      this.setState({
        highlight: null
      });
    }
  }

  onDrop(event) {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    if (this.state.highlight !== null) {
      this.setState({
        highlight: null
      });
    }

    try {
      const { suit, rank } = JSON.parse(event.dataTransfer.getData('card'));
      let straightIndex = null;
      let origin = Origin.Hand;

      let target = event.target;
      for (let i = 0; i < MAX_PARENT_DEPTH; i++) {
        if (target.classList.contains('card') && target.parentElement.classList.contains('straight')) {
          straightIndex = target.parentElement.dataset.index;
          break;
        }

        target = target.parentElement;
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
