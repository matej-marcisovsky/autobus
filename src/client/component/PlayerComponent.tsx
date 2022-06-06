import * as React from "react";
import classNames from "classnames";

import Player from "../../game/Player.js";
import Card from "../../game/Card.js";
import GameActionType from "../GameActionType.js";
import GameContext from "../GameContext.js";
import Origin from "../../game/Origin.js";
import { PLAYER_HAND_CARD_COUNT } from "../../game/Game.js";

import CounterComponent from "./CounterComponent.js";
import DelimiterComponent from "./DelimiterComponent.js";
import CardComponent from "./CardComponent.js";
import StockComponent from "./StockComponent.js";

interface Props {
  isEnemy?: boolean,
  player: Player,
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

  componentDidMount() {
    this.context.on(GameActionType.MoveCardToStock, (card) => this.onMoveCardToStock(card));
  }

  render() {
    const { isEnemy, player } = this.props;

    if (!player) {
      return null;
    }

    const currentPlayer = this.context.currentPlayer();

    return (
      <div className="container block is-flex is-flex-direction-column player">
        <div className="is-flex">
          <StockComponent cards={player.stock} isDraggable={!isEnemy && this.context.isPlayersTurn()} isDroppable={!isEnemy}/>
          <DelimiterComponent highlight={currentPlayer && currentPlayer.id === player.id}/>
          {this.renderPiles()}
        </div>
        {this.renderHand()}
      </div>
    );
  }

  private renderHand() {
    const { isEnemy, player } = this.props;

    if (isEnemy) {
      return null;
    }

    const { hand } = player;

    return (
      <div className="hand is-flex is-justify-content-center mt-6">
        {[...Array(PLAYER_HAND_CARD_COUNT)].map((_, index) => {
          const card = hand[index];

          if (!card) {
            return (
              <div key={index} className="card"/>
            );
          }

          return (
            <CardComponent key={index} card={card} isDraggable={this.context.isPlayersTurn()} inHand={true}/>
          );
        })}
      </div>
    );
  }

  private renderPiles() {
    return (
      <div className="piles is-flex">
        {this.props.player.piles.map((pile, index) => this.renderPile(pile, index))}
      </div>
    );
  }

  private renderPile(pile: Card[], index: number) {
    return (
      <div
        key={index}
        className={classNames('pile card mr-2', {
          'is-highlighted': this.state.highlight === index
        })}
        onDragOver={(event) => this.onDragOver(event, index)}
        onDrop={(event) => this.onDrop(event)}
        onDragLeave={() => this.onDragLeave()}>
        {!!pile.length && <CardComponent card={pile[0]} isDraggable={!this.props.isEnemy && this.context.isPlayersTurn()} inPile={true}/>}
        <CounterComponent>{pile.length}</CounterComponent>
      </div>
    );
  }

  onDragOver(event, index) {
    event.preventDefault();

    if (this.props.isEnemy || !this.context.isPlayersTurn()) {
      event.dataTransfer.dropEffect = 'none';

      if (this.state.highlight !== null) {
        this.setState({
          highlight: null
        });
      }

      return;
    }

    try {
      if (event.dataTransfer.types.includes('inpile')) {
        event.dataTransfer.dropEffect = 'none';

        if (this.state.highlight !== null) {
          this.setState({
            highlight: null
          });
        }

        return;
      }
    } catch (error) {
      console.error(error);
    }

    event.dataTransfer.dropEffect = 'move';

    if (this.state.highlight === null) {
      this.setState({
        highlight: index
      });
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
    if (this.props.isEnemy || !this.context.isPlayersTurn()) {
      return;
    }

    if (this.state.highlight !== null) {
      this.setState({
        highlight: null
      });
    }

    try {
      const { suit, rank } = JSON.parse(event.dataTransfer.getData('card'));

      this.props.player.moveCardToOrigin(this.props.player.findCardInOrigin(new Card(suit, rank), Origin.Hand), Origin.Pile);
      this.context.emit(GameActionType.EndTurn);
    } catch (error) {
      console.error(error);
    }
  }

  onMoveCardToStock(card: Card) {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    const { isEnemy, player } = this.props;

    if (isEnemy) {
      return;
    }

    try {
      player.moveCardToOrigin(player.findCardInOrigin(card, Origin.Hand), Origin.Stock);
      this.context.emit(GameActionType.EndTurn);
    } catch (error) {
      console.error(error);
    }
  }
}
