import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_PARADIGM_DATA } from "../data/paradigm.data";
import { ParadigmSchema, ParadigmSchemaType } from "../schema/paradigm-schema";
import { Paradigm } from "../twilights-fall/paradigm";

export class TFParadigmRegistry {
  private readonly _nsidToParadigm: Map<string, Paradigm> = new Map();

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToParadigm.keys());
  }

  getAllParadigms(): Array<Paradigm> {
    return Array.from(this._nsidToParadigm.values());
  }

  getByNsid(nsid: string): Paradigm | undefined {
    return this._nsidToParadigm.get(nsid);
  }

  load(source: NsidNameSchemaType, paradigmSchemas: Array<ParadigmSchemaType>): this {
    for (const paradigmSchema of paradigmSchemas) {
      // Validate schema (otherwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        ParadigmSchema.parse(paradigmSchema);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          paradigmSchema
        )}`;
        throw new Error(msg);
      }

      const paradigm: Paradigm = new Paradigm(source, paradigmSchema);
      const nsid: string = paradigm.getNsid();

      if (this._nsidToParadigm.has(nsid)) {
        throw new Error(`duplicate nsid: ${nsid}`);
      }

      this._nsidToParadigm.set(nsid, paradigm);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, paradigmSchemas] of Object.entries(SOURCE_TO_PARADIGM_DATA)) {
      this.load(source, paradigmSchemas);
    }
    return this;
  }
}
