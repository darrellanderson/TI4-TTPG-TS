import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_ABILITY_DATA } from "../data/ability.data";
import { AbilitySchema, AbilitySchemaType } from "../schema/ability-schema";
import { Ability } from "../twilights-fall/ability";

export class TFAbilityRegistry {
  private readonly _nsidToAbility: Map<string, Ability> = new Map();

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToAbility.keys());
  }

  getAllAbilities(): Array<Ability> {
    return Array.from(this._nsidToAbility.values());
  }

  getByNsid(nsid: string): Ability | undefined {
    return this._nsidToAbility.get(nsid);
  }

  load(source: NsidNameSchemaType, abilitySchemas: Array<AbilitySchemaType>): this {
    for (const abilitySchema of abilitySchemas) {
      // Validate schema (otherwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        AbilitySchema.parse(abilitySchema);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          abilitySchema
        )}`;
        throw new Error(msg);
      }

      const ability: Ability = new Ability(source, abilitySchema);
      const nsid: string = ability.getNsid();

      if (this._nsidToAbility.has(nsid)) {
        throw new Error(`duplicate nsid: ${nsid}`);
      }

      this._nsidToAbility.set(nsid, ability);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, abilitySchemas] of Object.entries(SOURCE_TO_ABILITY_DATA)) {
      this.load(source, abilitySchemas);
    }
    return this;
  }
}
