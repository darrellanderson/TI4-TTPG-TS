import { refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutScoringArea } from "./layout-scoring-area";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layoutScoringArea: LayoutScoringArea = new LayoutScoringArea(6);
layoutScoringArea.getLayout().doLayoutAtPoint(pos, yaw);
