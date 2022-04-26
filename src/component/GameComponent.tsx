import * as React from "react";

import Card from "../game/Card.js";
import Game from "../game/Game.js";
import Origin from "../game/Origin.js";

import DelimiterComponent from "./DelimiterComponent.js";
import PlayerComponent from "./PlayerComponent.js";
import StockComponent from "./StockComponent.js";
import StraightsComponent from "./StraightsComponent.js";

interface Props {
  game: Game
}

export default class extends React.Component<Props> {
  render() {
    const { game } = this.props;
    const { currentPlayer } = game;

    if (!currentPlayer) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="container block is-flex is-flex-direction-row mb-6">
          <StockComponent cards={game.stock} hideFace={true} isDroppable={false} onMoveCardToStock={null}/>
          <DelimiterComponent/>
          <StraightsComponent straights={game.straights} onMoveCardToStraight={(card, origin, straightIndex) => this.onMoveCardToStraight(card, origin, straightIndex)}/>
        </div>
        <PlayerComponent player={currentPlayer} onEndTurn={() => this.onEndTurn()}/>
      </React.Fragment>
    );
  }

  onEndTurn() {
    const { game } = this.props;

    try {
      game.endTurn();
      this.forceUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  onMoveCardToStraight(card: Card, origin: Origin, straightIndex: number) {
    const { game } = this.props;
    let straight = null;

    if (straightIndex !== null) {
      straight = game.straights[straightIndex];
    }

    try {
      game.moveCardToStraight(game.currentPlayer.findCardInOrigin(card, origin), origin, straight);

      this.forceUpdate();
    } catch (error) {
      console.error(error);
    }
  }
}
