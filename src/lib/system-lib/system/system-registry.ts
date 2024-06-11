import { System } from "./system";

export class SystemRegistry {
  private readonly _tileNumberToSystem: Map<number, System> = new Map();
  private readonly _tileObjIdToSystem: Map<string, System> = new Map();

  public getByTileNumber(tile: number): System | undefined {
    return this._tileNumberToSystem.get(tile);
  }

  public getByTileObjId(tileObjId: string): System | undefined {
    return this._tileObjIdToSystem.get(tileObjId);
  }

  public add(system: System) {
    const tileNumber: number = system.getTileNumber();
    const tileObjId: string | undefined = system.getSystemTileObjId();

    this._tileNumberToSystem.set(tileNumber, system);
    if (tileObjId) {
      this._tileObjIdToSystem.set(tileObjId, system);
    }
  }
}
