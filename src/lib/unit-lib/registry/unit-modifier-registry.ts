import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitModifierSchema,
  UnitModifierSchemaType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";
import { UnitModifier } from "../unit-modifier/unit-modifier";
import { SOURCE_TO_UNIT_MODIFIER_DATA } from "../data/unit-modifier.data";

export class UnitModifierRegistry {
  private readonly _nsidToSchema: Map<string, UnitModifier> = new Map();

  getAll(): Array<UnitModifier> {
    return Array.from(this._nsidToSchema.values());
  }

  getByNsid(nsid: string): UnitModifier | undefined {
    return this._nsidToSchema.get(nsid);
  }

  load(
    source: string,
    unitModifierSchemas: Array<UnitModifierSchemaType>
  ): this {
    for (const unitModifierSchema of unitModifierSchemas) {
      // Validate schema (oterhwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        UnitModifierSchema.parse(unitModifierSchema);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          unitModifierSchema
        )}`;
        throw new Error(msg);
      }

      const unitModifier = new UnitModifier(unitModifierSchema);

      const triggers: Array<UnitModifierTriggerType> =
        unitModifierSchema.triggers;
      for (const trigger of triggers) {
        const nsid: string | undefined = UnitModifier.schemaTriggerToNsid(
          source,
          trigger
        );
        if (nsid) {
          this._nsidToSchema.set(nsid, unitModifier);
        }
      }
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
