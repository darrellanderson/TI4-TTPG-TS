import { Vector, world } from "@tabletop-playground/api";
import { Find, HexType, NSID, ParsedNSID } from "ttpg-darrell";

import {
  UnitAttrsSchemaType,
  UnitType,
} from "lib/unit-lib/schema/unit-attrs-schema";
import { UnitAttrsSet } from "../../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";

export type CombatRollType =
  | "antiFighterBarrage"
  | "bombardment"
  | "spaceCannonOffense"
  | "spaceCannonDefense"
  | "spaceCombat"
  | "groundCombat";

export type CombatRollParams = {
  type: CombatRollType;
  hex: HexType;
  activatingPlayerSlot: number;
  rollingPlayerSlot: number;
};

export class CombatRoll {
  private readonly _params: CombatRollParams;
  private readonly _find: Find = new Find();

  _createUnitAttrsSet(playerSlot: number): UnitAttrsSet {
    const baseAttrs: Array<UnitAttrsSchemaType> =
      TI4.unitAttrsRegistry.getAllBaseAttrs();
    const unitAttrsSet: UnitAttrsSet = new UnitAttrsSet(baseAttrs);

    // Find unit upgrade cards owned by the player.
    const nsidNames: Array<string> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("card.technology.unit-upgrade")) {
        const pos: Vector = obj.getPosition();
        const closest: number = this._find.closestOwnedCardHolderOwner(pos);
        if (closest === playerSlot) {
          const parsed: ParsedNSID | undefined = NSID.parse(nsid);
          if (parsed) {
            const nsidName: string = parsed.nameParts.join(".");
            nsidNames.push(nsidName);
          }
        }
      }
    }

    // nsidNames sort in override order, faction override 1 then 2.
    nsidNames.sort();
    for (const nsidName of nsidNames) {
      const override: UnitAttrsSchemaType | undefined =
        TI4.unitAttrsRegistry.getOverrideAttrs(nsidName);
      if (override) {
        const unit: UnitType = override.unit;
        const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(unit);
        if (unitAttrs) {
          unitAttrs.applyOverride(override);
        }
      }
    }

    // Unit modifiers.
    // TODO XXX

    return unitAttrsSet;
  }

  constructor(params: CombatRollParams) {
    this._params = params;
  }

  public getType(): CombatRollType {
    return this._params.type;
  }
}
