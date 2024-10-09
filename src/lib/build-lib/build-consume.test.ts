import { MockGameObject } from "ttpg-mock";
import { BuildConsume } from "./build-consume";

it("constructor", () => {
  new BuildConsume([], []);
});

it("getters", () => {
  new MockGameObject({
    id: "rex",
    templateMetadata: "tile.system:base/18",
  });
  expect(TI4.systemRegistry.getBySystemTileObjId("rex")).toBeDefined();

  const objs = [
    new MockGameObject({
      templateMetadata: "token:base/tradegood-commodity-1",
    }),
    new MockGameObject({
      templateMetadata: "token:base/tradegood-commodity-1",
    }),
    new MockGameObject({
      templateMetadata: "token:base/tradegood-commodity-3",
    }),
    new MockGameObject({
      templateMetadata: "card.planet:base/mecatol-rex",
    }),
  ];

  const buildConsume: BuildConsume = new BuildConsume(objs, [
    "Mirror Computing",
    "Sarween Tools",
    "Xxekir Grom",
    "War Machine",
  ]);
  expect(buildConsume.getEntries().length).toBe(4);
  expect(buildConsume.getTradegoodValue()).toBe(10);
  expect(buildConsume.getPlanetValue()).toBe(7);
  expect(buildConsume.getTotalValue()).toBe(17);

  const report: string = buildConsume.report();
  expect(report).toBe("consuming $17+ST+WM: tradegoods (10), Mecatol Rex (7)");
});
