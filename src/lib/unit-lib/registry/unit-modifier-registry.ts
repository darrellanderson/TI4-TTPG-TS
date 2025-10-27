import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitModifierSchema,
  UnitModifierSchemaType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";
import { UnitModifier } from "../unit-modifier/unit-modifier";
import { SOURCE_TO_UNIT_MODIFIER_DATA } from "../data/unit-modifier.data";
import { NSID, ParsedNSID } from "ttpg-darrell";

export class UnitModifierRegistry {
  private readonly _nsidToSchema: Map<string, UnitModifier> = new Map();
  private readonly _always: Array<UnitModifier> = [];

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToSchema.keys());
  }

  getAllWithNsids(): Array<UnitModifier> {
    return Array.from(this._nsidToSchema.values());
  }

  getAlways(): Array<UnitModifier> {
    return [...this._always];
  }

  getByNsid(nsid: string): UnitModifier | undefined {
    if (
      nsid.endsWith(".1") ||
      nsid.endsWith(".2") ||
      nsid.endsWith(".3") ||
      nsid.endsWith(".4")
    ) {
      nsid = nsid.slice(0, nsid.length - 2);
    }
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
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

      if (unitModifierSchema.triggerAlways) {
        this._always.push(unitModifier);
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

  /**
   * Verify modifiers with tech or unit based triggers link to a known tech
   * or unit.
   *
   * @param errors
   * @returns
   */
  validate(errors: Array<string>): this {
    const nsids: Array<string> = [...this._nsidToSchema.keys()];
    for (const nsid of nsids) {
      // Make sure NSID is valid.
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed) {
        // If tech, make sure tech is registered.
        if (
          nsid.startsWith("card.technology") &&
          !TI4.techRegistry.getByNsid(nsid)
        ) {
          errors.push(`Tech not found: "${nsid}"`);
        }

        // If unit, make sure unit is registered.
        if (
          (nsid.startsWith("unit:") ||
            nsid.startsWith("card.technology.unit-upgrade:") ||
            nsid.startsWith("card.leader.mech:")) &&
          !TI4.unitAttrsRegistry.rawByNsid(nsid)
        ) {
          errors.push(`Unit not found: "${nsid}"`);
        }
      }
    }
    return this;
  }

  validateOrThrow(): this {
    const errors: Array<string> = [];
    this.validate(errors);
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
    return this;
  }
}
