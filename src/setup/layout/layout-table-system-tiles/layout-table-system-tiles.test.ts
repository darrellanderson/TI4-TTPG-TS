import { Container, GameObject, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { MockContainer, MockGameObject } from "ttpg-mock";

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
  const mecatol: GameObject = MockGameObject.simple("tile.system:base/18");
  const container: Container = new MockContainer({ items: [mecatol] });
  expect(mecatol.getContainer()).toBe(container);
  expect(container.getItems()).toContain(mecatol);

  const skipContained: boolean = false;
  const found: GameObject | undefined = new Find().findGameObject(
    "tile.system:base/18",
    undefined,
    skipContained
  );
  expect(found).toBeDefined();
  expect(found?.getId()).toEqual(mecatol.getId());

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTableSystemTiles().getLayout().doLayoutAtPoint(pos, yaw);

  expect(mecatol.getContainer()).toBe(undefined);
});
