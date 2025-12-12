import {
  Border,
  GameObject,
  globalEvents,
  Player,
  RichText,
  UIElement,
  UIPresentationStyle,
  Vector,
  Widget,
  world,
} from "@tabletop-playground/api";
import { Broadcast, HexType, IGlobal, NSID, PlayerSlot } from "ttpg-darrell";
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

export const NSID_BOOM_TOKEN: string = "token:thunders-edge/galvanize";
export const ACTION_BOOM: string = "*Roll Entity 4x41a Apollo";
export const TOOLTIP_BOOM: string =
  "Destroy units on galvanized unit's die roll";

/**
 * Right click a token to roll a die for every unit
 * in the system, destroy on this token's galvanized unit's value.
 */
export class RightClickGalvanizeToken implements IGlobal {
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
    const galvanizedPlastic: UnitPlastic | undefined =
      this._getGalvanizedPlastic(clickedObject, plastics);

    if (galvanizedPlastic) {
      // Get targets.
      const targetPlastics: Array<UnitPlastic> = this._getTargetPlastics(
        galvanizedPlastic.getOwningPlayerSlot(),
        plastics
      );

      const unitModifiers: Array<string> = [];
      const hitValue: number | undefined = this._getHitValue(
        hex,
        player.getSlot(),
        galvanizedPlastic.getUnit(),
        unitModifiers
      );
      if (unitModifiers.length === 0) {
        unitModifiers.push("none");
      }

      // Get target units.
      const areaToPlastics: Map<
        string,
        Array<UnitPlastic>
      > = this._getAreaToPlastics(targetPlastics);

      const msg: string = `Rolling boom!  Hits on ${hitValue} (Modifiers: ${unitModifiers.join(", ")})`;
      Broadcast.chatAll(msg);

      if (hitValue !== undefined) {
        this._rollBoom(areaToPlastics, hitValue);
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
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        const plasticPos: Vector = plastic.getPos();
        const plasticHex: HexType = TI4.hex.fromPosition(plasticPos);
        return plasticHex === hex;
      }
    );
    UnitPlastic.assignOwners(plastics);
    UnitPlastic.assignPlanets(
      plastics.filter((plastic: UnitPlastic): boolean => {
        return !this._isShip(plastic.getUnit());
      })
    );
    return plastics;
  }

  /**
   * After right clicking a galvanize token, get the linked galvanized unit.
   *
   * @param clickedObject
   * @param plastics
   * @returns
   */
  _getGalvanizedPlastic(
    clickedObject: GameObject,
    plastics: Array<UnitPlastic>
  ): UnitPlastic | undefined {
    for (const plastic of plastics) {
      if (plastic.getObj() === clickedObject) {
        return plastic.getLinkedPlastic();
      }
    }
  }

  _getTargetPlastics(
    omitPlayerSlot: number,
    plastics: Array<UnitPlastic>
  ): Array<UnitPlastic> {
    // UnitPlastic can find a few things that are not actually units.
    // Restrict to units.
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
    return plastics.filter((plastic: UnitPlastic): boolean => {
      return (
        validUnitTypeSet.has(plastic.getUnit()) &&
        plastic.getOwningPlayerSlot() !== omitPlayerSlot
      );
    });
  }

  _isShip(unit: UnitType): boolean {
    const defaultUnitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    const unitAttrs: UnitAttrs | undefined = defaultUnitAttrsSet.get(unit);
    return unitAttrs !== undefined && unitAttrs.isShip();
  }

  _getHitValue(
    hex: HexType,
    playerSlot: PlayerSlot,
    galvanizedUnit: UnitType,
    unitModifiers: Array<string>
  ): number | undefined {
    const isShip: boolean = this._isShip(galvanizedUnit);
    const rollType: CombatRollType = isShip ? "spaceCombat" : "groundCombat";

    const combatRoll: CombatRoll = CombatRoll.createCooked({
      hex,
      rollType,
      rollingPlayerSlot: playerSlot,
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
    if (combatAttrs) {
      unitModifiers.push(...combatRoll.getUnitModifierNamesWithDescriptions());
      return combatAttrs.getHit();
    }
  }

  _getAreaToPlastics(
    plastics: Array<UnitPlastic>
  ): Map<string, Array<UnitPlastic>> {
    const areaToPlastics: Map<string, Array<UnitPlastic>> = new Map<
      string,
      Array<UnitPlastic>
    >();
    for (const plastic of plastics) {
      const planet: Planet | undefined = plastic.getPlanetClosest();
      const area: string = planet?.getName() ?? "Space";
      let areaPlastics: Array<UnitPlastic> | undefined =
        areaToPlastics.get(area);
      if (!areaPlastics) {
        areaPlastics = [];
        areaToPlastics.set(area, areaPlastics);
      }
      areaPlastics.push(plastic);
    }
    return areaToPlastics;
  }

  _rollBoom(
    areaToPlastics: Map<string, Array<UnitPlastic>>,
    hitValue: number
  ): void {
    for (const [area, plastics] of areaToPlastics.entries()) {
      Broadcast.chatAll(area.toUpperCase());
      for (const plastic of plastics) {
        const rollValues: Array<number> = [];
        for (let i: number = 0; i < plastic.getCount(); i++) {
          const rollValue: number = Math.floor(Math.random() * 10) + 1;
          rollValues.push(rollValue);
        }
        this._applyBoomResult(plastic.getObj(), rollValues, hitValue);
      }
    }
  }

  _applyBoomResult(
    unitObj: GameObject,
    rollValues: Array<number>,
    hitValue: number
  ): void {
    const extraZ: number = 0.5;
    const currentRotation: boolean = true;
    const includeGeometry: boolean = false;
    const extent: Vector = unitObj.getExtent(currentRotation, includeGeometry);
    const above: Vector = unitObj.getPosition().add([0, 0, extent.z + extraZ]);
    const localAbove: Vector = unitObj.worldPositionToLocal(above);

    const bbTexts: Array<string> = [];
    for (const rollValue of rollValues) {
      const isHit: boolean = rollValue >= hitValue;
      const bbColor: string = isHit ? "#00ff00" : "#ff0000";
      const symbol: string = isHit ? "X" : "√";
      bbTexts.push(`[color=${bbColor}]${rollValue}${symbol}[/color]`);
    }

    const scale: number = 4;
    const widget: Widget = new RichText()
      .setBold(true)
      .setFontSize(12 * scale)
      .setText(bbTexts.join(""));

    const c = 0.02;
    const ui: UIElement = new UIElement();
    ui.position = localAbove;
    ui.presentationStyle = UIPresentationStyle.ViewAligned;
    ui.scale = 1 / scale;
    ui.useTransparency = true;
    ui.widget = new Border().setColor([c, c, c, 0.3]).setChild(widget);
    unitObj.addUI(ui);

    const onReleasedHandler = (obj: GameObject): void => {
      obj.removeUIElement(ui);
      obj.onReleased.remove(onReleasedHandler);
    };
    unitObj.onReleased.add(onReleasedHandler);

    // Also report in chat.
    const plastic: UnitPlastic | undefined = UnitPlastic.getOne(unitObj);
    if (plastic) {
      const playerName: string = TI4.playerName.getBySlot(
        plastic.getOwningPlayerSlot()
      );
      Broadcast.chatAll(
        `${plastic.getUnit()} (${playerName}) rolled ${rollValues.join(", ")})`
      );
    }
  }
}
