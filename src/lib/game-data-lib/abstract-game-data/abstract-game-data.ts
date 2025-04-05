import { PlayerSlot } from "ttpg-darrell";

export abstract class AbstractRootGameData<T> {
  /**
   * The name of the (root or in-player-entry) field.
   */
  abstract getFieldName(): string;

  /**
   * Root-level entry.
   *
   * @returns
   */
  abstract getRootData(): T | undefined;
}

export abstract class AbstractPerPlayerGameData<T> {
  /**
   * The name of the (root or in-player-entry) field.
   */
  abstract getFieldName(): string;

  /**
   * Per-player data entry.
   *
   * @returns
   */
  abstract getPlayerData(): Map<PlayerSlot, T> | undefined;
}
