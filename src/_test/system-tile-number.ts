/**
 * Display an oversize system tile number on system tiles.
 * Intended for screenshots to help IRL map building.
 */

import { GameObject, Text, UIElement, Vector } from "@tabletop-playground/api";
import { System } from "../lib/system-lib/system/system";

const skipContained: boolean = true;
const systems: Array<System> =
  TI4.systemRegistry.getAllSystemsWithObjs(skipContained);

systems.forEach((system: System): void => {
  const tile: number = system.getSystemTileNumber();
  const obj: GameObject = system.getObj();

  for (let dx = -0.5; dx <= 0.5; dx += 0.2) {
    for (let dy = -0.5; dy <= 0.5; dy += 0.2) {
      const textBg: Text = new Text()
        .setText(tile.toString())
        .setFontSize(50)
        .setTextColor([0, 0, 0, 1])
        .setBold(true);
      const uiBg: UIElement = new UIElement();
      uiBg.position = new Vector(dx, dy, 0.2);
      uiBg.widget = textBg;
      obj.addUI(uiBg);
    }
  }

  const textFg: Text = new Text()
    .setText(tile.toString())
    .setFontSize(50)
    .setTextColor([1, 1, 1, 1])
    .setBold(true);
  const uiFg: UIElement = new UIElement();
  uiFg.position = new Vector(0, 0, 0.21);
  uiFg.widget = textFg;
  obj.addUI(uiFg);
});
