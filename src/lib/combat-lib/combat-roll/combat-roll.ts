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
    return new CombatRoll(params)
      .applyUnitOverries()
      .applyUnitModifiersOrThrow();
  }

  constructor(params: CombatRollParams) {
    this._params = params;
    this._adjHexes = new SystemAdjacency().getAdjHexes(params.hex);

    this.self = {
      playerSlot: params.rollingPlayerSlot,
      unitAttrsSet: TI4.unitAttrsRegistry.defaultUnitAttrsSet(),
      unitPlasticHex: [],
      unitPlasticAdj: [],
    };
    this.opponent = {
      playerSlot:
        params.rollingPlayerSlot !== params.activatingPlayerSlot
          ? params.activatingPlayerSlot
          : -1,
      unitAttrsSet: TI4.unitAttrsRegistry.defaultUnitAttrsSet(),
      unitPlasticHex: [],
      unitPlasticAdj: [],
    };
  }

  _findUnitAttrOverrides(playerSlot: number): Array<UnitAttrsSchemaType> {
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

  _findUnitModifiers(
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
          this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
        ) {
          const pos: Vector = obj.getPosition();
          const closest: number = this._find.closestOwnedCardHolderOwner(pos);
          const isSelf: boolean = closest === selfSlot;
          const isOpponent: boolean = closest === opponentSlot;
          if (closest === selfSlot && isSelf) {
            unitModifiers.push(modifier);
          } else if (closest === opponentSlot && isOpponent) {
            unitModifiers.push(modifier);
          }
        }
      }
    }
    UnitModifier.sortByApplyOrder(unitModifiers);
    return unitModifiers;
  }

  public applyUnitOverries(): this {
    for (const data of [this.self, this.opponent]) {
      const unitOverrides: Array<UnitAttrsSchemaType> =
        this._findUnitAttrOverrides(this.self.playerSlot);
      for (const unitOverride of unitOverrides) {
        const unit: UnitType = unitOverride.unit;
        const unitAttrs: UnitAttrs | undefined = data.unitAttrsSet.get(unit);
        if (unitAttrs) {
          unitAttrs.applyOverride(unitOverride);
        }
      }
    }
    return this;
  }

  public applyUnitModifiers(errors: Array<Error>): this {
    const unitModifiers: Array<UnitModifier> = this._findUnitModifiers(
      this.self.playerSlot,
      this.opponent.playerSlot
    );
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
    return this;
  }

  public applyUnitModifiersOrThrow(): this {
    const errors: Array<Error> = [];
    this.applyUnitModifiers(errors);
    if (errors.length > 0) {
      const joined: string = errors.map((e) => e.stack).join("\n");
      throw new Error(joined);
    }
    return this;
  }

  public getType(): CombatRollType {
    return this._params.type;
  }
}
