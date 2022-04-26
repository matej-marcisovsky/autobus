import * as React from "react";

import Player from "../game/Player.js";
import Card from "../game/Card.js";
import Origin from "../game/Origin.js";
import { PLAYER_HAND_CARD_COUNT } from "../game//Game.js";

import CounterComponent from "./CounterComponent.js";
import DelimiterComponent from "./DelimiterComponent.js";
import CardComponent from "./CardComponent.js";
import StockComponent from "./StockComponent.js";

interface Props {
  player: Player,
  onEndTurn: Function
}

export default class extends React.Component<Props> {
  render() {
    const { player } = this.props;

    if (!player) {
      return null;
    }

    return (
      <div className="container block is-flex is-flex-direction-column player">
        <div className="is-flex">
          <StockComponent cards={player.stock} hideFace={false} isDroppable={true} onMoveCardToStock={(card) => this.onMoveCardToStock(card)}/>
          <DelimiterComponent/>
          {this.renderPiles()}
        </div>
        {this.renderHand()}
      </div>
    );
  }

  private renderHand() {
    const { hand } = this.props.player;

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
            <CardComponent key={index} card={card} isDroppable={false} inPile={false} inStock={false} hideFace={false}/>
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
        {!!pile.length && <CardComponent card={pile[0]} isDroppable={false} inPile={true} inStock={false} hideFace={false}/>}
        <CounterComponent>{pile.length}</CounterComponent>
      </div>
    );
  }

  onDragOver(event) {
    event.preventDefault();

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
    try {
      const { color, suit, rank } = JSON.parse(event.dataTransfer.getData('card'));

      this.props.player.moveCardToOrigin(this.props.player.findCardInOrigin(new Card(suit, rank, color), Origin.Hand), Origin.Pile);
      this.props.onEndTurn();
    } catch (error) {
      console.error(error);
    }
  }

  onMoveCardToStock(card: Card) {
    const { player } = this.props;

    try {
      player.moveCardToOrigin(player.findCardInOrigin(card, Origin.Hand), Origin.Stock);
      this.props.onEndTurn();
    } catch (error) {
      console.error(error);
    }
  }
}
