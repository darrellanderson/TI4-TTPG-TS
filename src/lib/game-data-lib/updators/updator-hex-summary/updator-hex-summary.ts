import { Vector, world } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { UnitPlastic } from "../../../unit-lib/unit-plastic/unit-plastic";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { EntityType, HexSummaryCodes } from "./hex-summary-codes";
import { SortEntityType } from "./sort-entity-type";
import { System } from "../../../system-lib/system/system";

// Top: system1,system2,...
// System: <tile><X><Y>space;planet1;planet2;...
// Region: <color[A-Z]><count[0-9]*><unit[a-z]>*<attachments>
// Within a system color is sticky (seed empty for tokens)
// Within a region count is sticky (seed 1), reset to 1 for attachments
const DELIMITER = {
  SYSTEM: ",",
  PLANET: ";",
  ATTACHMENTS: "*",
};

// Encode units in hexes
export class UpdatorHexSummary implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.hexSummary = this.encodeAll();
  }

  _getAllEntityTypes(): Array<EntityType> {
    const entityTypes: Array<EntityType> = [];
    const codes: HexSummaryCodes = new HexSummaryCodes();

    const plastics: Array<UnitPlastic> = UnitPlastic.getAll();
    UnitPlastic.assignOwners(plastics);
    for (const plastic of plastics) {
      const entity: EntityType | undefined = codes.unitEntity(plastic);
      if (entity) {
        entityTypes.push(entity);
      }
    }

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      let entity: EntityType | undefined;

      entity = codes.tokenEntity(obj);
      if (entity) {
        entityTypes.push(entity);
      }

      entity = codes.attachmentEntity(obj);
      if (entity) {
        entityTypes.push(entity);
      }
    }

    return entityTypes;
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

  /**
   * Seconds: hex position.
   * @param hex
   * @returns
   */
  _encodeHex(hex: HexType): string {
    const halfSize: number = 5.77735 * 1.5;
    const pos: Vector = TI4.hex.toPosition(hex);
    const scaleW = (halfSize * Math.sqrt(3)) / 2;
    const scaleH = halfSize * Math.sqrt(3);
    const y = Math.round(pos.x / scaleW);
    const x = Math.round(pos.y / scaleH);
    return `${x >= 0 ? "+" : ""}${x}${y >= 0 ? "+" : ""}${y}`;
  }

  /**
   * Third: what is in the system.
   * @param entityTypes
   * @returns
   */
  _encodeEntityTypes(entityTypes: Array<EntityType>): string {
    new SortEntityType().sort(entityTypes);
    entityTypes = this._mergeEntityTypes(entityTypes);

    const result: Array<string> = [];

    let stickyPlanetIndex = -1;
    let stickyColor = "";
    let stickyCount = 1;
    let stickyAttachment = false;

    for (const entry of entityTypes) {
      // Planet change?  (Keep color)
      if (entry.planetIndex !== stickyPlanetIndex) {
        result.push(DELIMITER.PLANET);
        stickyPlanetIndex = entry.planetIndex;
        stickyCount = 1;
        stickyAttachment = false;
      }

      // Attachment change?
      const attachment = entry.attachment ? true : false;
      if (attachment !== stickyAttachment) {
        // Should only ever toggle to true.
        result.push(DELIMITER.ATTACHMENTS);
        stickyColor = "";
        stickyCount = 1;
        stickyAttachment = attachment;
      }

      // Color change?
      const color = entry.colorCode !== undefined ? entry.colorCode : "";
      if (color !== stickyColor) {
        result.push(color);
        stickyColor = color;
        stickyCount = 1;
      }

      // Count change?
      if (entry.count !== stickyCount) {
        result.push(entry.count.toString());
        stickyCount = entry.count;
      }

      if (entry.code) {
        result.push(entry.code);
      }
    }
    return result.join("");
  }

  encodeAll(): string {
    const parts: Array<string> = [];

    const codes: HexSummaryCodes = new HexSummaryCodes();
    const hexToSystem: Map<HexType, System> = codes.getHexToSystem();

    const allEntityTypes: Array<EntityType> = this._getAllEntityTypes();
    for (const [hex, system] of hexToSystem.entries()) {
      if (parts.length > 0) {
        parts.push(DELIMITER.SYSTEM);
      }

      const tile: number = system.getSystemTileNumber();
      parts.push(tile.toString());
      parts.push(this._encodeHex(hex));

      const entityTypes: Array<EntityType> = allEntityTypes.filter(
        (entityType: EntityType) => {
          return entityType.hex === hex;
        }
      );
      parts.push(this._encodeEntityTypes(entityTypes));
    }

    return parts.join("");
  }
}
