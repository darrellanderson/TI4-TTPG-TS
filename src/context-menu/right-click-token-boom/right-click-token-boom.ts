import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, HexType, IGlobal, NSID } from "ttpg-darrell";
import {
  CombatRoll,
  CombatRollType,
} from "../../lib/combat-lib/combat-roll/combat-roll";
import { UnitType } from "../../lib/unit-lib/schema/unit-attrs-schema";
import { UnitAttrsSet } from "../../lib/unit-lib/unit-attrs-set/unit-attrs-set";
import { CombatAttrs } from "../../lib/unit-lib/unit-attrs/combat-attrs";
import { UnitAttrs } from "../../lib/unit-lib/unit-attrs/unit-attrs";
import { UnitPlastic } from "../../lib/unit-lib/unit-plastic/unit-plastic";
import { Planet } from "../../lib/system-lib/planet/planet";

export const NSID_BOOM_TOKEN: string = "token:homebrew.test/boom";
export const ACTION_BOOM: string = "*Boom";
export const TOOLTIP_BOOM: string = "Destroy units on some die roll";

/**
 * Testing for homebrew.  Right click a token to roll a die for every unit
 * in the system, destroy on some value.
 */
export class RightClickTokenBoom implements IGlobal {
  private readonly _onObjectCreated = (obj: GameObject): void => {
    this._maybeAddContextMenu(obj);
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_BOOM) {
      this._boom(object, player);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreated);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenu(obj);
    }
  }

  _maybeAddContextMenu(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid === NSID_BOOM_TOKEN) {
      obj.removeCustomAction(ACTION_BOOM);
      obj.addCustomAction(ACTION_BOOM, TOOLTIP_BOOM);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  }

  _boom(clickedObject: GameObject, player: Player): void {
    const pos: Vector = clickedObject.getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);

    // Get plastic/tokens in hex.
    const plastics: Array<UnitPlastic> = this._getPlasticInHex(hex);

    // Get the linked galvanized unit.
    const galvanizedUnit: UnitType | undefined = this._getGalvanizedUnit(
      clickedObject,
      plastics
    );

    if (galvanizedUnit) {
      const isShip: boolean = this._isShip(galvanizedUnit);
      const rollType: CombatRollType = isShip
        ? "spaceCombat"
        : "groundCombat";

    const combatRoll: CombatRoll = CombatRoll.createCooked({
      hex,
      rollType,
      rollingPlayerSlot: player.getSlot(),
      activatingPlayerSlot: -1,
    });
    const bakedUnitAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow(galvanizedUnit);

    let combatAttrs: CombatAttrs | undefined = undefined;
    if (bakedUnitAttrs.isShip()) {
      combatAttrs = bakedUnitAttrs.getSpaceCombat();
    } else {
      combatAttrs = bakedUnitAttrs.getGroundCombat();
    }
    if (!combatAttrs) {
      const msg: string = `No combat attrs for ${galvanizedUnit}`;
      Broadcast.chatAll(msg);
      return;
    }
    const hitValue: number = combatAttrs.getHit();

    // Get target units.
    const areaToUnitToCount: Map<string, Map<UnitType, number>> = new Map<
      string,
      Map<UnitType, number>
    >();
    const validUnitTypeSet: Set<UnitType> = new Set([
      "carrier",
      "cruiser",
      "destroyer",
      "dreadnought",
      "fighter",
      "flagship",
      "infantry",
      "mech",
      "pds",
      "space-dock",
      "war-sun",
    ]);
    for (const plastic of plastics) {
      const unit: UnitType = plastic.getUnit();
      if (validUnitTypeSet.has(unit)) {
        const _area: Planet | undefined = plastic.getPlanetClosest();
      }
    }
  }

  /**
   * Get plastics in the clicked object's hex.
   *
   * @param hex
   * @returns
   */
  _getPlasticInHex(hex: HexType): Array<UnitPlastic> {
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll()

    return plastics.getAll().filter((plastic: UnitPlastic): boolean => {
      const plasticPos: Vector = plastic.getObj().getPosition();
      const plasticHex: HexType = TI4.hex.fromPosition(plasticPos);
      return plasticHex === hex;
    });
  }

  /**
   * After right clicking a galvanize token, get the linked galvanized unit.
   *
   * @param clickedObject
   * @param plastics
   * @returns
   */
  _getGalvanizedUnit(
    clickedObject: GameObject,
    plastics: Array<UnitPlastic>
  ): UnitType | undefined {
    for (const plastic of plastics) {
      if (plastic.getObj() === clickedObject) {
        const linkedPlastic: UnitPlastic | undefined =
          plastic.getLinkedPlastic();
        if (linkedPlastic) {
          return linkedPlastic.getUnit();
        }
      }
    }
  }

  _isShip(unit: UnitType): boolean {
    const defaultUnitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    const unitAttrs: UnitAttrs | undefined = defaultUnitAttrsSet.get(unit);
    return unitAttrs !== undefined && unitAttrs.isShip();
  }
}
