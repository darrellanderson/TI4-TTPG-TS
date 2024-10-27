import { Faction } from "../faction/faction";
import { FactionSchema, FactionSchemaType } from "../schema/faction-schema";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_FACTION_DATA } from "../data/faction.data";
import { refPackageId, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";
import { REWRITE_NSIDS } from "../data/faction-nsid-rewrite.data";

export class FactionRegistry {
  private readonly _find: Find = new Find();
  private readonly _nsidToFaction: Map<string, Faction> = new Map();
  private readonly _nsidToRewriteNsid: Map<string, string> = new Map();

  constructor() {}

  getAllFactions(): Array<Faction> {
    return Array.from(this._nsidToFaction.values());
  }

  getAllFactionsFilteredByConfigSources(): Array<Faction> {
    const sources: Set<string> = new Set(TI4.config.sources);
    return this.getAllFactions().filter((faction) => {
      const source: string = faction.getSource();
      return sources.has(source);
    });
  }

  getByNsid(nsid: string): Faction | undefined {
    return this._nsidToFaction.get(nsid);
  }

  getByPlayerSlot(playerSlot: number): Faction | undefined {
    const playerSlotToFaction: Map<number, Faction> =
      this.getPlayerSlotToFaction();
    return playerSlotToFaction.get(playerSlot);
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

  loadRewriteLeader(rewrite: Record<string, string>): this {
    for (const [nsid, rewriteLeader] of Object.entries(rewrite)) {
      this._nsidToRewriteNsid.set(nsid, rewriteLeader);
    }
    return this;
  }

  loadDefaultRewriteNsid(): this {
    return this.loadRewriteLeader(REWRITE_NSIDS);
  }

  /**
   * Leader overrides may have a different source than the faction
   * (e.g. zeu.omega).
   *
   * @param nsid
   * @returns
   */
  rewriteNsid(nsid: string): string {
    const result: string | undefined = this._nsidToRewriteNsid.get(nsid);
    return result ? result : nsid;
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
      for (const nsid of faction.getFactionTechNsids()) {
        if (!TI4.techRegistry.getByNsid(nsid)) {
          errors.push(`faction tech nsidName not found: "${nsid}"`);
        }
      }
      for (const nsid of faction.getStartingTechNsids()) {
        if (!TI4.techRegistry.getByNsid(nsid)) {
          errors.push(`starting tech nsidName not found: "${nsid}"`);
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
