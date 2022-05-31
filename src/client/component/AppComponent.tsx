import * as React from "react";
import classNames from "classnames";

import ActionType from "../../ActionType.js";
import Game from "../../game/Game.js";
import GameActionType from "../GameActionType.js";
import GameComponent from "./GameComponent.js";
import GameContext from "../GameContext.js";
import Player from "../../game/Player.js";

interface Props { }

interface State {
  game?: Game;
  playerId?: number;
  winner?: Player;
}

export default class extends React.Component<Props, State> {
  private idRef = React.createRef<HTMLInputElement>();

  static contextType: React.Context<any> = GameContext;

  constructor(props) {
    super(props);

    this.state = {
      game: null,
      playerId: null,
      winner: null
    };
  }

  componentDidCatch(error, errorInfo) {
    alert(`${error.action}: ${error.status}`); // TODO Better error handling.
  }

  componentDidMount() {
    this.context.on(GameActionType.UpdateState, ({ game, playerId }) => this.setState({
      game,
      playerId
    }));
    this.context.on(GameActionType.EndGame, (winner) => this.setState({ winner }));
  }

  render() {
    return (
      <div className="container is-relative">
        {this._renderEndNotification()}
        {this.state.game ? this._renderGame() : this._renderForm()}
      </div>
    );
  }

  _renderEndNotification() {
    const { playerId, winner } = this.state;

    if (!winner) {
      return null;
    }

    const success = winner.id === playerId;

    return (
      <div
        className={classNames('notification', {
          'is-danger': !success,
          'is-success': success,
        })}>
          {success ? 'Vyhráváš!' : 'Prohráváš..'}
      </div>
    );
  }

  _renderGame() {
    const { game, playerId } = this.state;

    return (
      <>
        {this._renderCopyForm()}
        {this._renderInfoBar()}
        <GameComponent game={game} playerId={playerId} />
      </>
    );
  }

  _renderCopyForm() {
    const { game } = this.state;

    if (!game.players.find((player) => !player.hasUser)) {
      return null;
    }

    return (
      <div className="box">
        <nav className="level">
          <div className="level-left">
            Pošli kód spoluhráči!
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="field has-addons">
                <div className="control">
                  <input className="input" type="text" value={game.id} readOnly />
                </div>
                <div className="control">
                  <button className="button is-info" onClick={() => this.onCopyGameId()}>Kopírovat do schránky</button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  _renderForm() {
    return (
      <div className="box">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button is-primary" onClick={() => this.context.emit(ActionType.NewGame)}>Nová hra</button>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="field has-addons">
                <div className="control">
                  <input className="input" ref={this.idRef} type="text" placeholder="Kód hry" />
                </div>
                <div className="control">
                  <button className="button is-info" onClick={() => this.onJoinGame()}>Připojit se</button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  _renderInfoBar() {
    const { game } = this.state;

    if (game.players.find((player) => !player.hasUser)) {
      return null;
    }

    return (
      <div className="box">
        <nav className="level">
          <div className="level-left">
            {this.context.isPlayersTurn() ? 'Jsi na řadě.' : 'Hraje spoluhráč.'}
          </div>
          <div className="level-right" />
        </nav>
      </div>
    );
  }

  onCopyGameId() {
    navigator.clipboard.writeText(this.state.game.id);
  }

  onJoinGame() {
    const { current: idInput } = this.idRef;

    this.context.emit(ActionType.JoinGame, idInput.value);
  }
}
