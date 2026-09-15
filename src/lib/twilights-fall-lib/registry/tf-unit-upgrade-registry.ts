import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_UNIT_UPGRADE_DATA } from "../data/unit-upgrade.data";
import { UnitUpgradeSchema, UnitUpgradeSchemaType } from "../schema/unit-upgrade-schema";
import { UnitUpgrade } from "../twilights-fall/unit-upgrade";

export class TFUnitUpgradeRegistry {
  private readonly _nsidToUnitUpgrade: Map<string, UnitUpgrade> = new Map();

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToUnitUpgrade.keys());
  }

  getAllUnitUpgrades(): Array<UnitUpgrade> {
    return Array.from(this._nsidToUnitUpgrade.values());
  }

  getByNsid(nsid: string): UnitUpgrade | undefined {
    return this._nsidToUnitUpgrade.get(nsid);
  }

  load(source: NsidNameSchemaType, unitUpgradeSchemas: Array<UnitUpgradeSchemaType>): this {
    for (const unitUpgradeSchema of unitUpgradeSchemas) {
      // Validate schema (otherwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        UnitUpgradeSchema.parse(unitUpgradeSchema);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          unitUpgradeSchema
        )}`;
        throw new Error(msg);
      }

      const unitUpgrade: UnitUpgrade = new UnitUpgrade(source, unitUpgradeSchema);
      const nsid: string = unitUpgrade.getNsid();

      if (this._nsidToUnitUpgrade.has(nsid)) {
        throw new Error(`duplicate nsid: ${nsid}`);
      }

      this._nsidToUnitUpgrade.set(nsid, unitUpgrade);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, unitUpgradeSchemas] of Object.entries(SOURCE_TO_UNIT_UPGRADE_DATA)) {
      this.load(source, unitUpgradeSchemas);
    }
    return this;
  }
}
