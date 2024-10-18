import { Faction } from "../faction/faction";

export abstract class AbstractUnpack {
  private readonly _faction: Faction;
  private readonly _playerSlot: number;

  constructor(faction: Faction, playerSlot: number) {
    this._faction = faction;
    this._playerSlot = playerSlot;
  }

  getFaction(): Faction {
    return this._faction;
  }

  getPlayerSlot(): number {
    return this._playerSlot;
  }

  abstract unpack(): void;
  abstract remove(): void;
}
