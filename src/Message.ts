import ActionType from './ActionType.js';

export default class Message {
  readonly action: ActionType;
  readonly status?: number;
  readonly data?: any;
  readonly game?: any;

  static error(action, status = 500): Message {
    return new Message(action, status);
  }

  static fromBuffer(buffer): Message {
    try {
      const { action, status, data, game } = JSON.parse(buffer.toString());

      return new Message(action, status, data, game);
    } catch (error) {
      return Message.error(error);
    }
  }

  constructor(action: ActionType, status: number = 200, data: any = null, game: any = null) {
    this.action = action;
    this.status = status;
    this.data = data;
    this.game = game;
  }

  toString() {
    return JSON.stringify(this);
  }
};
