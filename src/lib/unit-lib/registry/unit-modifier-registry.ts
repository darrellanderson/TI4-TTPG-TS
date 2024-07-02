import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitModifierSchema,
  UnitModifierSchemaType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";
import { UnitModifier } from "../unit-modifier/unit-modifier";
import { SOURCE_TO_UNIT_MODIFIER_DATA } from "../data/unit-modifier.data";

export class UnitModifierRegistry {
  private readonly _nsidToSchema: Map<string, UnitModifierSchemaType> =
    new Map();
  private readonly _nsidNameToSchema: Map<string, UnitModifierSchemaType> =
    new Map();

  rawByNsid(nsid: string): UnitModifierSchemaType | undefined {
    return this._nsidToSchema.get(nsid);
  }

  rawByNsidName(nsidName: string): UnitModifierSchemaType | undefined {
    return this._nsidNameToSchema.get(nsidName);
  }

  load(source: string, unitModifiers: Array<UnitModifierSchemaType>): this {
    for (const unitModifier of unitModifiers) {
      // Validate schema (oterhwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        UnitModifierSchema.parse(unitModifier);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          unitModifier
        )}`;
        throw new Error(msg);
      }

      const triggers: Array<UnitModifierTriggerType> =
        unitModifier.triggers ?? [];
      for (const trigger of triggers) {
        const nsid: string | undefined = UnitModifier.schemaTriggerToNsid(
          source,
          trigger
        );
        if (nsid) {
          this._nsidToSchema.set(nsid, unitModifier);
        }
        if (trigger.nsidName) {
          this._nsidNameToSchema.set(trigger.nsidName, unitModifier);
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
