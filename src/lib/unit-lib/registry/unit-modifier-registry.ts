import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitModifierSchema,
  UnitModifierSchemaType,
} from "../schema/unit-modifier-schema";
import { SOURCE_TO_UNIT_MODIFIER_DATA } from "../data/unit-modifier.data";

export class UnitModifierRegistry {
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
