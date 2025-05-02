import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { EntityType } from "./hex-summary-codes";

// Encode units in hexes
export class UpdatorHexSummary implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.hexSummary = "foo";
  }

  _mergeEntityTypes(entityTypes: Array<EntityType>): Array<EntityType> {
    const merged: Array<EntityType> = [];
    for (const entityType of entityTypes) {
      // Start with the first.
      if (merged.length === 0) {
        merged.push(entityType);
        continue;
      }

      // If the previous is the same, merge.
      const prev: EntityType | undefined = merged[merged.length - 1];
      if (
        prev &&
        prev.code === entityType.code &&
        prev.colorCode === entityType.colorCode &&
        prev.planetIndex === entityType.planetIndex
      ) {
        prev.count = prev.count + entityType.count;
        continue;
      }

      // Otherwise, add a new one.
      merged.push(entityType);
    }

    return merged;
  }
}
