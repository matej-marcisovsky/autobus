import * as React from "react";

import Card from "../../game/Card.js";
import Game from "../../game/Game.js";
import GameActionType from "../GameActionType.js";
import GameContext from "../GameContext.js";
import Origin from "../../game/Origin.js";

import DelimiterComponent from "./DelimiterComponent.js";
import PlayerComponent from "./PlayerComponent.js";
import StockComponent from "./StockComponent.js";
import StraightsComponent from "./StraightsComponent.js";
import ActionType from "../../ActionType.js";

interface Props {
  game: Game,
  playerId: number
}

export default class extends React.Component<Props> {
  static contextType: React.Context<any> = GameContext;

  componentDidMount() {
    this.context.on(GameActionType.EndTurn, () => this.onEndTurn());
    this.context.on(GameActionType.MoveCardToStraight, ({ card, origin, straightIndex }) => this.onMoveCardToStraight(card, origin, straightIndex));
  }

  render() {
    const { game, playerId } = this.props;

    if (!game) {
      return null;
    }

    // TODO more enemy players
    return (
      <div className="is-flex is-justify-content-center is-flex-direction-column">
        <PlayerComponent player={game.players[playerId === 0 ? 1 : 0]} isEnemy={true}/>
        <div className="container block is-flex is-flex-direction-row mb-6 app--middle">
          <StockComponent cards={game.stock} hideFace={true} isDraggable={false} isDroppable={false}/>
          <DelimiterComponent/>
          <StraightsComponent straights={game.straights}/>
        </div>
        <PlayerComponent player={game.players[playerId]}/>
      </div>
    );
  }

  onEndTurn() {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    const { game } = this.props;

    try {
      game.endTurn();
      this.context.emit(ActionType.UpdateGame);
      this.forceUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  onMoveCardToStraight(card: Card, origin: Origin, straightIndex: number) {
    if (!this.context.isPlayersTurn()) {
      return;
    }

    const { game } = this.props;

    let straight = null;

    if (straightIndex !== null) {
      straight = game.straights[straightIndex];
    }

    try {
      game.moveCardToStraight(game.currentPlayer.findCardInOrigin(card, origin), origin, straight);

      this.context.emit(ActionType.UpdateGame);
      this.forceUpdate();
    } catch (error) {
      console.error(error);
    }
  }
}
