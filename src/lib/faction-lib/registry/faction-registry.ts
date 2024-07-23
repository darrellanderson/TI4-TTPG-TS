import { FactionSchema, FactionSchemaType } from "../schema/faction-schema";
import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_FACTION_DATA } from "../data/faction.data";

export class FactionRegistry {
  private readonly _nsidNameToFaction: Map<string, FactionSchemaType> =
    new Map();

  constructor() {}

  getAllFactions(): Array<FactionSchemaType> {
    return Array.from(this._nsidNameToFaction.values());
  }

  rawByNsidName(nsidName: string): FactionSchemaType | undefined {
    return this._nsidNameToFaction.get(nsidName);
  }

  load(source: string, factions: Array<FactionSchemaType>): this {
    for (const faction of factions) {
      // Validate schema (oterhwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        FactionSchema.parse(faction);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(faction)}`;
        throw new Error(msg);
      }
      this._nsidNameToFaction.set(faction.nsidName, faction);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, factions] of Object.entries(SOURCE_TO_FACTION_DATA)) {
      this.load(source, factions);
    }
    return this;
  }
}
