import { refObject, Vector, world } from "@tabletop-playground/api";
import { LayoutUnitBoxes } from "./layout-unit-boxes";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}

const playerSlot: number = 11;
const pos: Vector = new Vector(0, 0, world.getTableHeight() + 1);
const yaw: number = 0;
new LayoutUnitBoxes(playerSlot).getLayout().doLayoutAtPoint(pos, yaw);
