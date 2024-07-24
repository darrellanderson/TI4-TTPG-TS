import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_TECH_DATA } from "../data/tech.data";
import { TechSchema, TechSchemaType } from "../schema/tech-schema";
import { Tech } from "../tech/tech";

export class TechRegistry {
  private readonly _nsidNameToTech: Map<NsidNameSchemaType, Tech> = new Map();

  getByNsidName(nsidName: NsidNameSchemaType): Tech | undefined {
    return this._nsidNameToTech.get(nsidName);
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

      const nsidName: string = techSchema.nsidName;
      const tech: Tech = new Tech(source, techSchema);

      if (this._nsidNameToTech.has(nsidName)) {
        throw new Error(`duplicate nsidName: ${nsidName}`);
      }
      this._nsidNameToTech.set(nsidName, tech);
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
