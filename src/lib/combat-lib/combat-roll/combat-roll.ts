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
    const overrideAttrsArray: Array<UnitAttrsSchemaType> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const attrs: UnitAttrsSchemaType | undefined =
        TI4.unitAttrsRegistry.rawByNsid(nsid);
      if (attrs) {
        const pos: Vector = obj.getPosition();
        const closest: number = this._find.closestOwnedCardHolderOwner(pos);
        if (closest === playerSlot) {
          overrideAttrsArray.push(attrs);
        }
      }
    }

    // nsidNames sort in override order, faction override 1 then 2.
    UnitAttrs.sortByOverrideOrder(overrideAttrsArray);
    for (const overrideAttrs of overrideAttrsArray) {
      const unit: UnitType = overrideAttrs.unit;
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(unit);
      if (unitAttrs) {
        unitAttrs.applyOverride(overrideAttrs);
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
