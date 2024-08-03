import { Faction } from "../faction/faction";
import { FactionSchema, FactionSchemaType } from "../schema/faction-schema";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_FACTION_DATA } from "../data/faction.data";
import { refPackageId, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

export class FactionRegistry {
  private readonly _find: Find = new Find();
  private readonly _nsidToFaction: Map<string, Faction> = new Map();

  constructor() {}

  getAllFactions(): Array<Faction> {
    return Array.from(this._nsidToFaction.values());
  }

  getByNsid(nsid: string): Faction | undefined {
    return this._nsidToFaction.get(nsid);
  }

  getPlayerSlotToFaction(): Map<number, Faction> {
    const playerSlotToFaction: Map<number, Faction> = new Map();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      let nsid: string = NSID.get(obj);
      if (nsid.startsWith("sheet.faction:")) {
        nsid = nsid.replace("sheet.faction:", "faction:");
      }
      const faction: Faction | undefined = this.getByNsid(nsid);
      if (faction) {
        const pos: Vector = obj.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
        playerSlotToFaction.set(playerSlot, faction);
      }
    }
    return playerSlotToFaction;
  }

  load(
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    factions: Array<FactionSchemaType>
  ): this {
    for (const factionSchemaType of factions) {
      // Validate schema (oterhwise not validated until used).
      try {
        SourceAndPackageIdSchema.parse(sourceAndPackageId);
        FactionSchema.parse(factionSchemaType);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          factionSchemaType
        )}`;
        throw new Error(msg);
      }
      const faction: Faction = new Faction(
        sourceAndPackageId,
        factionSchemaType
      );
      this._nsidToFaction.set(faction.getNsid(), faction);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, factions] of Object.entries(SOURCE_TO_FACTION_DATA)) {
      const sourceAndPackageId: SourceAndPackageIdSchemaType = {
        source,
        packageId: refPackageId,
      };
      this.load(sourceAndPackageId, factions);
    }
    return this;
  }

  /**
   * Verify modifiers with tech or unit based triggers link to a known tech
   * or unit.
   *
   * @param errors
   * @returns
   */
  validate(errors: Array<string>): this {
    for (const faction of this.getAllFactions()) {
      for (const nsidName of faction.getFactionTechNsidNames()) {
        if (!TI4.techRegistry.rawByNsidName(nsidName)) {
          errors.push(`faction tech nsidName not found: "${nsidName}"`);
        }
      }
      for (const nsidName of faction.getStartingTechNsidNames()) {
        if (!TI4.techRegistry.rawByNsidName(nsidName)) {
          errors.push(`starting tech nsidName not found: "${nsidName}"`);
        }
      }
      for (const nsid of faction.getUnitOverrideNsids()) {
        if (!TI4.unitAttrsRegistry.rawByNsid(nsid)) {
          errors.push(`unit override nsid not found: "${nsid}"`);
        }
      }
    }
    return this;
  }

  validateOrThrow(): this {
    const errors: Array<string> = [];
    this.validate(errors);
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
    return this;
  }
}
