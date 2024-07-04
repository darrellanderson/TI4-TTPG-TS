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
import { Planet } from "lib/system-lib/planet/planet";
import { GameObject } from "ttpg-mock";

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
  planetName?: string; // for planet-based rolls
  activatingPlayerSlot: number;
  rollingPlayerSlot: number;
};

export class CombatRollPerPlayerData {
  public playerSlot: number = -1;
  public readonly unitAttrsSet: UnitAttrsSet =
    TI4.unitAttrsRegistry.defaultUnitAttrsSet();
  public readonly unitPlasticHex: Array<UnitPlastic> = [];
  public readonly unitPlasticAdj: Array<UnitPlastic> = [];

  /**
   * Try to add a synthetic unit to the player's unit set.
   * Only works if unit type does not already exist.
   *
   * The schema.unit "UnitType" restriction may need to be
   * violated with a "string as UnitType" cast.
   *
   * @param schema
   * @param count
   * @returns
   */
  addSyntheticUnit(schema: UnitAttrsSchemaType, count: number): boolean {
    if (!this.unitAttrsSet.addSyntheticUnit(schema)) {
      return false;
    }
    // Fake object, will not resolve to correct hex so downstream users
    // need to trust the "unitPlasticHex" is correct.
    const obj: GameObject = new GameObject();
    this.unitPlasticHex.push(new UnitPlastic(schema.unit, count, obj));
    return true;
  }

  hasUnit(unit: UnitType): boolean {
    for (const unitPlastic of this.unitPlasticHex) {
      if (unitPlastic.getUnit() === unit) {
        return true;
      }
    }
    return false;
  }
}

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

    this.self = new CombatRollPerPlayerData();
    this.self.playerSlot = params.rollingPlayerSlot;

    this.opponent = new CombatRollPerPlayerData();
    this.opponent.playerSlot = -1;
    if (params.rollingPlayerSlot !== params.activatingPlayerSlot) {
      this.opponent.playerSlot = params.activatingPlayerSlot;
    }
  }

  _findUnitPlastics(): Array<UnitPlastic> {
    const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (unitPlastic): boolean => {
        return (
          unitPlastic.getHex() === this._params.hex ||
          this._adjHexes.has(unitPlastic.getHex())
        );
      }
    );
    UnitPlastic.assignOwners(unitPlastics);
    UnitPlastic.assignPlanets(unitPlastics);
    return unitPlastics;
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

  public applyUnitPlastic(): this {
    const unitPlastics: Array<UnitPlastic> = this._findUnitPlastics();

    const isGroundSet: Set<UnitType> = new Set();
    const isShipSet: Set<UnitType> = new Set();
    for (const unitAttrs of this.opponent.unitAttrsSet.getAll()) {
      if (unitAttrs.isGround()) {
        isGroundSet.add(unitAttrs.getUnit());
      }
      if (unitAttrs.isShip()) {
        isShipSet.add(unitAttrs.getUnit());
      }
    }

    // If opponent is not assigned, look for units belonging to another player.
    // (Look only at units in some "area", space or ground.)
    if (this.opponent.playerSlot === -1) {
      let relevant: Array<UnitPlastic> = [];
      if (this._params.planetName) {
        relevant = unitPlastics.filter((unitPlastic) => {
          const planet: Planet | undefined = unitPlastic.getPlanetClosest();
          return (
            isGroundSet.has(unitPlastic.getUnit()) &&
            planet &&
            planet.getName() === this._params.planetName
          );
        });
      } else {
        relevant = unitPlastics.filter((unitPlastic) => {
          return isShipSet.has(unitPlastic.getUnit());
        });
      }
      // For now, pick the first other player in the relevant units.
      // If there are multiple players, this will need to be refined.
      for (const unitPlastic of relevant) {
        const playerSlot: number = unitPlastic.getOwningPlayerSlot();
        if (playerSlot !== -1 && playerSlot !== this.self.playerSlot) {
          this.opponent.playerSlot = playerSlot;
          break;
        }
      }
    }

    // Fill in all units for each player.
    // Do not prune here, unit modifiers may add attributes.
    for (const unitPlastic of unitPlastics) {
      // Self or opponent?
      const playerSlot: number = unitPlastic.getOwningPlayerSlot();
      let playerData: CombatRollPerPlayerData | undefined = undefined;
      if (playerSlot === this.self.playerSlot) {
        playerData = this.self;
      } else if (playerSlot === this.opponent.playerSlot) {
        playerData = this.opponent;
      }
      if (playerData) {
        if (unitPlastic.getHex() === this._params.hex) {
          playerData.unitPlasticHex.push(unitPlastic);
        } else {
          playerData.unitPlasticAdj.push(unitPlastic);
        }
      }
    }

    return this;
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
