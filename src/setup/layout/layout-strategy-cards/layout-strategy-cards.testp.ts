import { refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutStrategyCards } from "./layout-strategy-cards";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layoutStrategyCards: LayoutStrategyCards = new LayoutStrategyCards();
layoutStrategyCards.getLayout().doLayoutAtPoint(pos, yaw);
