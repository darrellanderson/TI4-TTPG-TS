import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_TECH_DATA } from "../data/tech.data";
import { TechSchema, TechSchemaType } from "../schema/tech-schema";
import { Tech } from "../tech/tech";

export class TechRegistry {
  private readonly _nsidToTech: Map<string, Tech> = new Map();

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToTech.keys());
  }

  getAllTechs(): Array<Tech> {
    return Array.from(this._nsidToTech.values());
  }

  getByNsid(nsid: string): Tech | undefined {
    return this._nsidToTech.get(nsid);
  }

  getByNsidNameMaybeOmegaToo(nsidName: string): Array<Tech> {
    const result: Array<Tech> = [];
    for (const tech of this._nsidToTech.values()) {
      if (tech.getNsidName().startsWith(nsidName)) {
        result.push(tech);
      }
    }
    return result;
  }

  load(source: NsidNameSchemaType, techSchemas: Array<TechSchemaType>): this {
    for (const techSchema of techSchemas) {
      // Validate schema (oterhwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        TechSchema.parse(techSchema);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          techSchema
        )}`;
        throw new Error(msg);
      }

      const tech: Tech = new Tech(source, techSchema);
      const nsid: string = tech.getNsid();

      if (this._nsidToTech.has(nsid)) {
        throw new Error(`duplicate nsid: ${nsid}`);
      }
      if (
        tech.isFactionTech() &&
        tech.getColor() === "unit-upgrade" &&
        !tech.replacesNsidName()
      ) {
        throw new Error(
          `unit-upgrade tech must have replacesNsidName: ${nsid}`
        );
      }

      this._nsidToTech.set(nsid, tech);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, techSchemas] of Object.entries(SOURCE_TO_TECH_DATA)) {
      this.load(source, techSchemas);
    }
    return this;
  }
}
