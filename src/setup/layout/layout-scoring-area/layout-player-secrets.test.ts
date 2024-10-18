import { Vector } from "@tabletop-playground/api";
import { LayoutPlayerSecrets } from "./layout-player-secrets";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutPlayerSecrets(4).getLayout().doLayoutAtPoint(pos, yaw);
});
