import { Vector, world } from "@tabletop-playground/api";
import {
  Adjacency,
  CardUtil,
  Find,
  HexType,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";

import {
  UnitAttrsSchemaType,
  UnitType,
} from "lib/unit-lib/schema/unit-attrs-schema";
import { UnitAttrsSet } from "../../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
import { UnitPlastic } from "lib/unit-lib/unit-plastic/unit-plastic";

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
  private readonly _adjacency: Adjacency = new Adjacency();
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

  _calculateAdjacency(): void {
    // TODO
  }

  _createUnitAttrsSet(): UnitAttrsSet {
    const baseAttrs: Array<UnitAttrsSchemaType> =
      TI4.unitAttrsRegistry.getAllBaseAttrs();
    const unitAttrsSet: UnitAttrsSet = new UnitAttrsSet(baseAttrs);
    return unitAttrsSet;
  }

  _applyUnitAttrs(unitAttrsSet: UnitAttrsSet, playerSlot: number): void {
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

    // nsidNames sort in override order, faction override 1 then 2.
    UnitAttrs.sortByOverrideOrder(overrideAttrsArray);
    for (const overrideAttrs of overrideAttrsArray) {
      const unit: UnitType = overrideAttrs.unit;
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(unit);
      if (unitAttrs) {
        unitAttrs.applyOverride(overrideAttrs);
      }
    }
  }

  _applyUnitModifiers(
    unitAttrsSet: UnitAttrsSet,
    selfSlot: number,
    opponentSlot: number
  ): void {
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
          // TODO XXX
        }
      }
    }
  }

  constructor(params: CombatRollParams) {
    this._params = params;

    this.unitAttrsSet = {
      self: this._createUnitAttrsSet(),
      opponent: this._createUnitAttrsSet(),
    };
  }

  public getType(): CombatRollType {
    return this._params.type;
  }
}
