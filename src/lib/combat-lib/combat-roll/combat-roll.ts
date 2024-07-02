import { Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, HexType, NSID } from "ttpg-darrell";

import { SystemAdjacency } from "../../system-lib/system-adjacency/system-adjacency";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { UnitAttrsSet } from "../../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";
import { UnitModifierSchemaType } from "../../unit-lib/schema/unit-modifier-schema";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";

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
  private readonly _adjHexes: Set<HexType>;

  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  // Unit modifers may look into and modify unit attributes.
  public readonly unitAttrsSet: {
    self: UnitAttrsSet;
    opponent: UnitAttrsSet;
  };
  // Units in system and adjacent systems.
  public readonly unitPlastic: Array<UnitPlastic> = [];
  // Convenience summary of counts.
  public readonly unitToHexCount: Map<UnitType, number> = new Map(); // local hex
  public readonly unitToAdjCount: Map<UnitType, number> = new Map(); // adjacent hexes

  _createUnitAttrsSet(): UnitAttrsSet {
    const baseAttrs: Array<UnitAttrsSchemaType> =
      TI4.unitAttrsRegistry.getAllBaseAttrs();
    const unitAttrsSet: UnitAttrsSet = new UnitAttrsSet(baseAttrs);
    return unitAttrsSet;
  }

  _getUnitAttrOverrides(playerSlot: number): Array<UnitAttrsSchemaType> {
    // Find unit upgrade cards owned by the player.
    const overrideAttrsArray: Array<UnitAttrsSchemaType> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const attrs: UnitAttrsSchemaType | undefined =
        TI4.unitAttrsRegistry.rawByNsid(nsid);
      if (attrs) {
        const allowFaceDown: boolean = false;
        const rejectSnapPointTags: Array<string> = []; // TODO XXX
        if (
          this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
        ) {
          const pos: Vector = obj.getPosition();
          const closest: number = this._find.closestOwnedCardHolderOwner(pos);
          if (closest === playerSlot) {
            overrideAttrsArray.push(attrs);
          }
        }
      }
    }
    UnitAttrs.sortByOverrideOrder(overrideAttrsArray);
    return overrideAttrsArray;
  }

  _applyUnitAttrs(
    unitAttrsSet: UnitAttrsSet,
    overrideAttrsArray: Array<UnitAttrsSchemaType>
  ): void {
    // nsidNames sort in override order, faction override 1 then 2.
    for (const overrideAttrs of overrideAttrsArray) {
      const unit: UnitType = overrideAttrs.unit;
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(unit);
      if (unitAttrs) {
        unitAttrs.applyOverride(overrideAttrs);
      }
    }
  }

  _getUnitModifiers(
    selfSlot: number,
    opponentSlot: number
  ): Array<UnitModifierSchemaType> {
    const unitModifiers: Array<UnitModifierSchemaType> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const modifier: UnitModifierSchemaType | undefined =
        TI4.unitModifierRegistry.rawByNsid(nsid);
      if (modifier) {
        const allowFaceDown: boolean = false;
        const rejectSnapPointTags: Array<string> = []; // TODO XXX
        if (
          !this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
        ) {
          const pos: Vector = obj.getPosition();
          const closest: number = this._find.closestOwnedCardHolderOwner(pos);
          if (closest === selfSlot && modifier.owner === "self") {
            unitModifiers.push(modifier);
          } else if (
            closest === opponentSlot &&
            modifier.owner === "opponent"
          ) {
            unitModifiers.push(modifier);
          }
        }
      }
    }
    UnitModifier.sortByApplyOrder(unitModifiers);
    return unitModifiers;
  }

  _applyUnitModifiers(
    unitModifiers: Array<UnitModifierSchemaType>,
    errors: Array<Error>
  ): void {
    for (const modifier of unitModifiers) {
      // Run each modifier in a try/catch block, an error will only suppress
      // one modifier, not the whole set (or the call stack!).
      try {
        if (modifier.applies && modifier.applies(this)) {
          if (modifier.apply) {
            modifier.apply(this);
          }
        }
      } catch (e) {
        errors.push(e);
      }
    }
  }

  constructor(params: CombatRollParams) {
    this._params = params;
    this._adjHexes = new SystemAdjacency().getAdjHexes(params.hex);

    this.unitAttrsSet = {
      self: this._createUnitAttrsSet(),
      opponent: this._createUnitAttrsSet(),
    };
  }

  public getType(): CombatRollType {
    return this._params.type;
  }
}
