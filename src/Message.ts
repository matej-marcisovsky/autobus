import type { RawData } from 'ws';

import type { ActionType } from './ActionType.js';

export class Message {
  readonly action: ActionType;
  readonly status?: number;
  readonly data?: any;
  readonly game?: any;

  static error(action: ActionType, status = 500): Message {
    return new Message(action, status);
  }

  static fromBuffer(buffer: RawData): Message {
    try {
      const { action, status, data, game } = JSON.parse(buffer.toString());

      return new Message(action, status, data, game);
    } catch (error) {
      // @ts-expect-error FIXME
      return Message.error(error);
    }
  }

  constructor(
    action: ActionType,
    status: number = 200,
    data: any = null,
    game: any = null,
  ) {
    this.action = action;
    this.status = status;
    this.data = data;
    this.game = game;
  }

  toString() {
    return JSON.stringify(this);
  }
}
