import { PlayerSlot } from "ttpg-darrell";

export abstract class AbstractGameData<T> {
  /**
   * The name of the (root or in-player-entry) field.
   */
  abstract getFieldName(): string;

  /**
   * Root-level entry.
   *
   * @returns
   */
  getRootData(): T | undefined {
    return undefined;
  }

  /**
   * Per-player data entry.
   *
   * @returns
   */
  getPlayerData(): Map<PlayerSlot, T> | undefined {
    return undefined;
  }
}
