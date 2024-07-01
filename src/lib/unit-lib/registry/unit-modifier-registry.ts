import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitModifierSchema,
  UnitModifierSchemaType,
} from "../schema/unit-modifier-schema";
import { SOURCE_TO_UNIT_MODIFIER_DATA } from "../data/unit-modifier.data";
import { UnitModifier } from "../unit-modifier/unit-modifier";

export class UnitModifierRegistry {
  private readonly _nsidToSchema: Map<string, UnitModifierSchemaType> =
    new Map();

  rawByNsid(nsid: string): UnitModifierSchemaType | undefined {
    return this._nsidToSchema.get(nsid);
  }

  load(source: string, unitAttrsArray: Array<UnitModifierSchemaType>): this {
    for (const unitAttrs of unitAttrsArray) {
      // Validate schema (oterhwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        UnitModifierSchema.parse(unitAttrs);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          unitAttrs
        )}`;
        throw new Error(msg);
      }

      const nsid: string | undefined = UnitModifier.schemaToNsid(
        source,
        unitAttrs
      );
      if (nsid) {
        this._nsidToSchema.set(nsid, unitAttrs);
      }

      // TODO XXX
    }
    return this;
  }

  /**
   * Load the game data (base plus codices and expansions).
   *
   * @returns
   */
  public loadDefaultData(): this {
    for (const [source, unitAttrsArray] of Object.entries(
      SOURCE_TO_UNIT_MODIFIER_DATA
    )) {
      this.load(source, unitAttrsArray);
    }
    return this;
  }
}
