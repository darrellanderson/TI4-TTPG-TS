import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_FACTION_TECH_DATA } from "../data/faction-tech.data";
import { FactionTechSchema, FactionTechSchemaType } from "../schema/faction-tech-schema";
import { FactionTech } from "../twilights-fall/faction-tech";

export class TFFactionTechRegistry {
  private readonly _nsidToFactionTech: Map<string, FactionTech> = new Map();

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToFactionTech.keys());
  }

  getAllFactionTechs(): Array<FactionTech> {
    return Array.from(this._nsidToFactionTech.values());
  }

  getByNsid(nsid: string): FactionTech | undefined {
    return this._nsidToFactionTech.get(nsid);
  }

  load(source: NsidNameSchemaType, factionTechSchemas: Array<FactionTechSchemaType>): this {
    for (const factionTechSchema of factionTechSchemas) {
      // Validate schema (otherwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        FactionTechSchema.parse(factionTechSchema);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          factionTechSchema
        )}`;
        throw new Error(msg);
      }

      const factionTech: FactionTech = new FactionTech(source, factionTechSchema);
      const nsid: string = factionTech.getNsid();

      if (this._nsidToFactionTech.has(nsid)) {
        throw new Error(`duplicate nsid: ${nsid}`);
      }

      this._nsidToFactionTech.set(nsid, factionTech);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, factionTechSchemas] of Object.entries(SOURCE_TO_FACTION_TECH_DATA)) {
      this.load(source, factionTechSchemas);
    }
    return this;
  }
}
