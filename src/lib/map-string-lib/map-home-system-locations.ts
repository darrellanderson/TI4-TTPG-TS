import { Vector } from "@tabletop-playground/api";

export class MapHomeSystemLocations {
  private readonly _playerCount: number;

  constructor(playerCount: number) {
    this._playerCount = playerCount;
  }

  get(playerSlot: number): Vector {
    // TODO XXX
  }
}
