import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";

import { BuildProduce } from "./build-produce";
import { UnitAttrsSet } from "lib/unit-lib/unit-attrs-set/unit-attrs-set";

it("constructor", () => {
  const unitAttrsSet: UnitAttrsSet =
    TI4.unitAttrsRegistry.defaultUnitAttrsSet();
  new BuildProduce([], unitAttrsSet);
});

it("getters", () => {
  const objs: Array<GameObject> = [
    new MockGameObject({ templateMetadata: "token:base/infantry-1" }),
    new MockGameObject({ templateMetadata: "token:base/infantry-3" }),
    new MockGameObject({ templateMetadata: "token:base/fighter-1" }),
    new MockGameObject({ templateMetadata: "token:base/fighter-3" }),
    new MockGameObject({ templateMetadata: "unit:base/infantry" }),
  ];
  const unitAttrsSet: UnitAttrsSet =
    TI4.unitAttrsRegistry.defaultUnitAttrsSet();

  const buildProduce = new BuildProduce(objs, unitAttrsSet);
  expect(buildProduce.getEntries().length).toBe(5);
  expect(buildProduce.getPlasticCount()).toBe(9);

  const systemTileObj: GameObject = new MockGameObject();
  buildProduce.moveToSystemTile(systemTileObj);

  const report: string = buildProduce.report();
  expect(report).toBe("producing $10: 4 fighters, 5 infantry");
});
