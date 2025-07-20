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
import { Broadcast, HexType, IGlobal } from "ttpg-darrell";

import { System } from "../../lib/system-lib/system/system";
import { UnitAttrs } from "../../lib/unit-lib/unit-attrs/unit-attrs";
import { UnitAttrsSet } from "../../lib/unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitPlastic } from "../../lib/unit-lib/unit-plastic/unit-plastic";

export const RIFT_ACTION_NAME: string = "*Rift All Ships In System";
export const RIFT_ACTION_TOOLTIP: string =
  "Roll for all ships in the system, show result on ship (lift and drop to remove)";

export class RightClickRift implements IGlobal {
  /**
   * Display the rift result as UI, goes away on object drop.
   *
   * @param unitObj
   * @param rollValue
   * @param surviveOn
   */
  static applyRiftResult(
    unitObj: GameObject,
    rollValue: number,
    surviveOn: number = 4
  ): void {
    const extraZ: number = 0.5;
    const currentRotation: boolean = true;
    const includeGeometry: boolean = false;
    const extent: Vector = unitObj.getExtent(currentRotation, includeGeometry);
    const above: Vector = unitObj.getPosition().add([0, 0, extent.z + extraZ]);
    const localAbove: Vector = unitObj.worldPositionToLocal(above);

    const isSurvivor: boolean = rollValue >= surviveOn;
    const bbColor: string = isSurvivor ? "#00ff00" : "#ff0000";
    const symbol: string = isSurvivor ? "√" : "X";

    const scale: number = 4;
    const widget: Widget = new RichText()
      .setBold(true)
      .setFontSize(12 * scale)
      .setText(`[color=${bbColor}]${rollValue}${symbol}[/color]`);

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
      Broadcast.chatAll(
        `${plastic?.getUnit} rolled ${rollValue}: (${isSurvivor ? "survived" : "destroyed"})`
      );
    }
  }

  static getShipsInRift(riftObj: GameObject): Array<GameObject> {
    const hex: HexType = TI4.hex.fromPosition(riftObj.getPosition());
    const unitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic) => {
        const isHex: boolean = plastic.getHex() === hex;
        if (!isHex) {
          return false;
        }
        const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
          plastic.getUnit()
        );
        return unitAttrs !== undefined && unitAttrs.isShip();
      }
    );
    UnitPlastic.assignOwners(plastics);
    return plastics.map((plastic) => plastic.getObj());
  }

  static isRiftSystemTile(obj: GameObject): boolean {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    return (
      system !== undefined && system.getAnomalies().includes("gravity-rift")
    );
  }

  static rollRift(riftObj: GameObject): void {
    Broadcast.chatAll(`Rolling for all ships in the rift`);
    const ships: Array<GameObject> = RightClickRift.getShipsInRift(riftObj);
    for (const ship of ships) {
      const rollValue: number = Math.floor(Math.random() * 10) + 1;
      RightClickRift.applyRiftResult(ship, rollValue);
    }
  }

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._onObjectCreatedHandler(obj);
    }
  }

  _onObjectCreatedHandler = (obj: GameObject): void => {
    if (RightClickRift.isRiftSystemTile(obj)) {
      obj.removeCustomAction(RIFT_ACTION_NAME);
      obj.addCustomAction(RIFT_ACTION_NAME, RIFT_ACTION_TOOLTIP);
      obj.onCustomAction.remove(this._onCustomActionHandler);
      obj.onCustomAction.add(this._onCustomActionHandler);
    }
  };

  _onCustomActionHandler = (
    obj: GameObject,
    _player: Player,
    identifier: string
  ): void => {
    if (identifier === RIFT_ACTION_NAME) {
      RightClickRift.rollRift(obj);
    }
  };
}
