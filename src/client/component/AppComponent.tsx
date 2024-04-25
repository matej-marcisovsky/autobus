import classNames from 'classnames';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { GameComponent } from './GameComponent.js';
import { ActionType } from '../../ActionType.js';
import type { Game } from '../../game/Game.js';
import type { Player } from '../../game/Player.js';
import { GameActionType } from '../GameActionType.js';
import { GameContext } from '../GameContext.js';

const QUERY_PARAM_NAME = 'id';

function AppComponent() {
  const context = useContext(GameContext);

  const idRef = useRef<HTMLInputElement>(null);

  const [game, setGame] = useState<Game>();

  const [playerId, setPlayerId] = useState<number>();

  const [winner, setWinner] = useState<Player>();

  const link = useMemo(
    () =>
      `${location.origin}?${QUERY_PARAM_NAME}=${encodeURIComponent(game?.id as string)}`,
    [game],
  );

  const onUpdateState = useCallback(
    ({ game, playerId }: { game: Game; playerId: number }) => {
      setGame(game);
      setPlayerId(playerId);
    },
    [],
  );

  const onEndGame = useCallback((winner: Player) => {
    setWinner(winner);
  }, []);

  useEffect(() => {
    context?.on(GameActionType.UpdateState, onUpdateState);
    context?.on(GameActionType.EndGame, onEndGame);

    const urlParams = new URLSearchParams(location.search);
    if (urlParams.has(QUERY_PARAM_NAME)) {
      context?.emit(ActionType.JoinGame, urlParams.get(QUERY_PARAM_NAME));
    }

    return () => {
      context?.off(GameActionType.UpdateState, onUpdateState);
      context?.off(GameActionType.EndGame, onEndGame);
    };
  }, [context, onEndGame, onUpdateState]);

  const onJoinGame = useCallback(() => {
    const { current: idInput } = idRef;

    context?.emit(ActionType.JoinGame, idInput?.value);
  }, [context]);

  const onCopyGameLink = useCallback(() => {
    navigator.clipboard.writeText(link);
  }, [link]);

  const success = winner?.id === playerId;
  const hasFreePlayer = game?.players.find(player => !player.hasUser);

  return (
    <div className='container is-relative'>
      {winner && (
        <div
          className={classNames('notification', {
            'is-danger': !success,
            'is-success': success,
          })}
        >
          {success ? 'Vyhráváš!' : 'Prohráváš..'}
        </div>
      )}
      {game ? (
        <>
          {hasFreePlayer && (
            <>
              <div className='box'>
                <nav className='level'>
                  <div className='level-left'>Pošli kód spoluhráči!</div>
                  <div className='level-right'>
                    <div className='level-item'>
                      <div className='field has-addons'>
                        <div className='control'>
                          <input
                            className='input'
                            type='text'
                            value={game.id}
                            readOnly
                          />
                        </div>
                        <div className='control'>
                          <button
                            className='button is-info'
                            onClick={onCopyGameLink}
                          >
                            Kopírovat odkaz
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
              <div className='box'>
                <nav className='level'>
                  <div className='level-left'>
                    {context?.isPlayersTurn()
                      ? 'Jsi na řadě.'
                      : 'Hraje spoluhráč.'}
                  </div>
                  <div className='level-right' />
                </nav>
              </div>
            </>
          )}
          <GameComponent game={game as Game} playerId={playerId as number} />
        </>
      ) : (
        <div className='box'>
          <nav className='level'>
            <div className='level-left'>
              <div className='level-item'>
                <button
                  className='button is-primary'
                  onClick={() => context?.emit(ActionType.NewGame)}
                >
                  Nová hra
                </button>
              </div>
            </div>
            <div className='level-right'>
              <div className='level-item'>
                <div className='field has-addons'>
                  <div className='control'>
                    <input
                      className='input'
                      ref={idRef}
                      type='text'
                      placeholder='Kód hry'
                    />
                  </div>
                  <div className='control'>
                    <button className='button is-info' onClick={onJoinGame}>
                      Připojit se
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

const MemoizedGameComponent = memo(AppComponent);

export { MemoizedGameComponent as AppComponent };
