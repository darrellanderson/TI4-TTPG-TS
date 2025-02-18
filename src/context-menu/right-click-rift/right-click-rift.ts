import {
  Border,
  GameObject,
  globalEvents,
  RichText,
  UIElement,
  UIPresentationStyle,
  Vector,
  Widget,
  world,
} from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

import { System } from "../../lib/system-lib/system/system";

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
  }

  static isRiftSystemTile(obj: GameObject): boolean {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    return (
      system !== undefined && system.getAnomalies().includes("gravity-rift")
    );
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
      //
    }
  };
}
