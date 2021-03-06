import * as React from "react";
import classNames from "classnames";

import Card from "../../game/Card.js";
import Color from "../../game/Color.js";
import GameContext from "../GameContext.js";
import Rank from "../../game/Rank.js";
import Suit from "../../game/Suit.js";

interface Props {
  card: Card,
  isDraggable?: boolean,
  inHand?: boolean,
  inPile?: boolean,
  inStock?: boolean
}

interface State {
  highlight: boolean;
}

export default class extends React.Component<Props, State> {
  private rootRef = React.createRef<HTMLDivElement>();
  private tempCardElm: HTMLDivElement;

  static contextType: React.Context<any> = GameContext;

  componentWillUnmount() {
    if (this.tempCardElm) {
      this.tempCardElm.remove();
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      highlight: false
    };
  }

  render() {
    const { card, isDraggable } = this.props;

    if (!card) {
      return null;
    }

    return (
      <div
        ref={this.rootRef}
        className={classNames('card playing-card', {
          'is-clickable': isDraggable,
          'is-highlighted': this.state.highlight,
          'playing-card--red': card.color === Color.Red
        })}
        onDragStart={(event) => this.onDragStart(event)}
        onDragEnd={() => this.onDragEnd()}
        draggable={isDraggable}
      >
        {this._renderFace()}
      </div>
    );
  }

  _renderFace() {
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
    const { card, inHand, inPile, inStock } = this.props;

    event.dataTransfer.setData('card', JSON.stringify(card));
    event.dataTransfer.effectAllowed = 'move';

    if (this.tempCardElm) {
      this.tempCardElm.remove();
    }

    if (inPile) {
      event.dataTransfer.setData('inpile', JSON.stringify(true));
    } else if (inStock) {
      event.dataTransfer.setData('instock', JSON.stringify(true));
    } else if (inHand) {
      const { current: cardElm } = this.rootRef;

      if (!cardElm) {
        return;
      }

      this.tempCardElm = cardElm.cloneNode(true) as HTMLDivElement;
      this.tempCardElm.classList.add('playing-card--temp');

      document.body.appendChild(this.tempCardElm);

      event.dataTransfer.setDragImage(this.tempCardElm, 50, 50)
    }
  }

  onDragEnd() {
    if (this.tempCardElm) {
      this.tempCardElm.remove();
    }
  }
}
