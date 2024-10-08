import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";

import { BuildProduce } from "./build-produce";

it("constructor", () => {
  new BuildProduce([]);
});

it("getters", () => {
  const objs: Array<GameObject> = [
    new MockGameObject({ templateMetadata: "token:base/infantry-1" }),
    new MockGameObject({ templateMetadata: "token:base/infantry-3" }),
    new MockGameObject({ templateMetadata: "token:base/fighter-1" }),
    new MockGameObject({ templateMetadata: "token:base/fighter-3" }),
    new MockGameObject({ templateMetadata: "unit:base/infantry" }),
  ];

  const buildProduce = new BuildProduce(objs);
  expect(buildProduce.getEntries().length).toBe(5);

  const systemTileObj: GameObject = new MockGameObject();
  buildProduce.moveToSystemTile(systemTileObj);

  const report: string = buildProduce.report();
  expect(report).toBe("producing 4 fighter, 5 infantry");
});
