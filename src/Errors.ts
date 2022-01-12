export class InvalidGameMove extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'InvalidGameMove';
  }
}

export class UnknownPlayer extends Error {
  constructor() {
    super();

    this.name = 'UnknownPlayer';
    this.message = 'Player could not be found in this game.';
  }
}
