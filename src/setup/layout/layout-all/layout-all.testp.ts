import { refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutAll } from "./layout-all";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layout: LayoutAll = new LayoutAll(7);
layout.getLayout().doLayoutAtPoint(pos, yaw);
