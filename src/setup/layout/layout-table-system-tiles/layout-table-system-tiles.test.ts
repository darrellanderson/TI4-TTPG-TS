import { Container, GameObject, Vector } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";
import { MockContainer } from "ttpg-mock";

import { LayoutTableSystemTiles } from "./layout-table-system-tiles";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("layout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTableSystemTiles().getLayout().doLayoutAtPoint(pos, yaw);
});

it("move tile from container", () => {
  const mecatol: GameObject = Spawn.spawnOrThrow("tile.system:base/18");
  const container: Container = new MockContainer({ items: [mecatol] });
  expect(mecatol.getContainer()).toBe(container);

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTableSystemTiles().getLayout().doLayoutAtPoint(pos, yaw);

  expect(mecatol.getContainer()).toBe(undefined);
});
