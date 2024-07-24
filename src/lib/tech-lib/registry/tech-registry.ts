import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
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

      const tech: Tech = new Tech(source, techSchema);
      this._nsidNameToTech.set(tech.getNsidName(), tech);
    }
    return this;
  }
}
