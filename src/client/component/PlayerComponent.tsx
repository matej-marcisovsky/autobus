import * as React from "react";

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

export default class extends React.Component<Props> {
  static contextType: React.Context<any> = GameContext;

  componentDidMount() {
    this.context.on(GameActionType.MoveCardToStock, (card) => this.onMoveCardToStock(card));
  }

  render() {
    const { isEnemy, player } = this.props;

    if (!player) {
      return null;
    }

    return (
      <div className="container block is-flex is-flex-direction-column player">
        <div className="is-flex">
          <StockComponent cards={player.stock} hideFace={false} isDraggable={!isEnemy && this.context.isPlayersTurn()} isDroppable={!isEnemy}/>
          <DelimiterComponent/>
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
            <CardComponent key={index} card={card} isDraggable={this.context.isPlayersTurn()} isDroppable={false} inPile={false} inStock={false} hideFace={false}/>
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
        className="pile card mr-2"
        onDragOver={(event) => this.onDragOver(event)}
        onDrop={(event) => this.onDrop(event)}
      >
        {!!pile.length && <CardComponent card={pile[0]} isDraggable={!this.props.isEnemy && this.context.isPlayersTurn()} isDroppable={false} inPile={true} inStock={false} hideFace={false}/>}
        <CounterComponent>{pile.length}</CounterComponent>
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

    if (this.props.isEnemy || !this.context.isPlayersTurn()) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    try {
      if (event.dataTransfer.types.includes('inpile')) {
        event.dataTransfer.dropEffect = 'none';
        return;
      }
    } catch (error) {
      console.error(error);
    }

    event.dataTransfer.dropEffect = 'move';
  }

  onDrop(event) {
    if (this.props.isEnemy || !this.context.isPlayersTurn()) {
      return;
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
