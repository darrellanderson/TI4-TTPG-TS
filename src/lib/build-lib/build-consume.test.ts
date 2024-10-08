import { MockGameObject } from "ttpg-mock";
import { BuildConsume } from "./build-consume";

it("constructor", () => {
  new BuildConsume([]);
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

  const buildConsume: BuildConsume = new BuildConsume(objs);
  expect(buildConsume.getEntries().length).toBe(4);
  expect(buildConsume.getTradegoodValue()).toBe(5);
  expect(buildConsume.getPlanetValue()).toBe(1);
});
