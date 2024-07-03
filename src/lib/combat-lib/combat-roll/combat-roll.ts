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

export type CombatRollPerPlayerData = {
  playerSlot: number;
  unitAttrsSet: UnitAttrsSet;
  unitPlasticHex: Array<UnitPlastic>;
  unitPlasticAdj: Array<UnitPlastic>;
};

export class CombatRoll {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  private readonly _params: CombatRollParams;
  private readonly _adjHexes: Set<HexType>;

  // Unit modifers may look into and modify unit attributes.
  public readonly self: CombatRollPerPlayerData;
  public readonly opponent: CombatRollPerPlayerData;

  static createCooked(params: CombatRollParams): CombatRoll {
    return new CombatRoll(params).applyUnitOverries().applyUnitModifiers();
  }

  constructor(params: CombatRollParams) {
    this._params = params;
    this._adjHexes = new SystemAdjacency().getAdjHexes(params.hex);

    this.self = {
      playerSlot: -1,
      unitAttrsSet: TI4.unitAttrsRegistry.defaultUnitAttrsSet(),
      unitPlasticHex: [],
      unitPlasticAdj: [],
    };
    this.opponent = {
      playerSlot: -1,
      unitAttrsSet: TI4.unitAttrsRegistry.defaultUnitAttrsSet(),
      unitPlasticHex: [],
      unitPlasticAdj: [],
    };
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
  ): Array<UnitModifier> {
    const unitModifiers: Array<UnitModifier> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const modifier: UnitModifier | undefined =
        TI4.unitModifierRegistry.getByNsid(nsid);
      if (modifier) {
        const allowFaceDown: boolean = false;
        const rejectSnapPointTags: Array<string> = []; // TODO XXX
        if (
          !this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
        ) {
          const pos: Vector = obj.getPosition();
          const closest: number = this._find.closestOwnedCardHolderOwner(pos);
          if (closest === selfSlot && modifier.getOwner() === "self") {
            unitModifiers.push(modifier);
          } else if (
            closest === opponentSlot &&
            modifier.getOwner() === "opponent"
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
    unitModifiers: Array<UnitModifier>,
    errors: Array<Error>
  ): void {
    for (const modifier of unitModifiers) {
      // Run each modifier in a try/catch block, an error will only suppress
      // one modifier, not the whole set (or the call stack!).
      try {
        if (modifier.applies(this)) {
          modifier.apply(this);
        }
      } catch (e) {
        errors.push(e);
      }
    }
  }

  public applyUnitOverries(): this {
    let unitOverrides: Array<UnitAttrsSchemaType>;
    unitOverrides = this._getUnitAttrOverrides(this.self.playerSlot);
    this._applyUnitAttrs(this.self.unitAttrsSet, unitOverrides);
    unitOverrides = this._getUnitAttrOverrides(this.opponent.playerSlot);
    this._applyUnitAttrs(this.opponent.unitAttrsSet, unitOverrides);
    return this;
  }

  public applyUnitModifiers(): this {
    const errors: Array<Error> = [];
    const unitModifiers: Array<UnitModifier> = this._getUnitModifiers(
      this.self.playerSlot,
      this.opponent.playerSlot
    );
    this._applyUnitModifiers(unitModifiers, errors);
    if (errors.length > 0) {
      throw errors[0]; // for now, log to console for production release
    }
    return this;
  }

  public getType(): CombatRollType {
    return this._params.type;
  }
}
