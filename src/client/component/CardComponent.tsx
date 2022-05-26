import * as React from "react";
import classNames from "classnames";

import Card from "../../game/Card.js";
import Color from "../../game/Color.js";
import GameContext from "../GameContext.js";
import Rank from "../../game/Rank.js";
import Suit from "../../game/Suit.js";

interface Props {
  card: Card,
  isDraggable: boolean,
  isDroppable: boolean,
  inPile: boolean,
  inStock: boolean,
  hideFace: boolean
}

export default class extends React.Component<Props> {
  static contextType: React.Context<any> = GameContext;

  render() {
    const { card, isDraggable } = this.props;

    if (!card) {
      return null;
    }

    return (
      <div
        className={classNames('card playing-card', {
          'is-clickable': isDraggable,
          'playing-card--red': card.color === Color.Red
        })}
        onDragStart={(event) => this.onDragStart(event)}
        onDragOver={(event) => this.onDragOver(event)}
        draggable={isDraggable}
      >
        {this._renderFace()}
      </div>
    );
  }

  _renderFace() {
    const { hideFace } = this.props;

    if (hideFace) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="playing-card__symbol is-flex is-flex-direction-column">
          {this._renderRank()}
          {this._renderSuit()}
        </div>
        <div className="playing-card__symbol playing-card__symbol--bottom is-flex is-flex-direction-column">
          {this._renderRank()}
          {this._renderSuit()}
        </div>
      </React.Fragment>
    );
  }

  _renderRank() {
    const { card } = this.props;

    let code = [191];
    switch (card.rank) {
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
    }

    return (
      <span className="playing-card__rank">{String.fromCharCode(...code)}</span>
    );
  }

  _renderSuit() {
    const { card } = this.props;

    let code = 191;
    switch (card.suit) {
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

    return (
      <span className="playing-card__suit">{String.fromCharCode(code)}</span>
    );
  }

  onDragStart(event) {
    const { card, inPile, inStock } = this.props;

    event.dataTransfer.setData('card', JSON.stringify(card));
    event.dataTransfer.effectAllowed = 'move';

    if (inPile) {
      event.dataTransfer.setData('inpile', JSON.stringify(true));
    }

    if (inStock) {
      event.dataTransfer.setData('instock', JSON.stringify(true));
    }
  }

  onDragOver(event) {
    if (!this.context.isPlayersTurn()) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    event.dataTransfer.dropEffect = this.props.isDroppable ? 'move' : 'none';
  }
}
