import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { BuildConsume } from "./build-consume";
import { Find } from "ttpg-darrell";

it("constructor", () => {
  new BuildConsume([], []);
});

it("getters", () => {
  new MockGameObject({
    id: "rex",
    templateMetadata: "tile.system:base/18",
  });
  expect(
    globalThis.TI4.systemRegistry.getBySystemTileObjId("rex")
  ).toBeDefined();

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
  expect(buildConsume.getTotalValueWithModifiers()).toBe("17+ST+WM");

  const report: string = buildConsume.report();
  expect(report).toBe("consuming $17+ST+WM: tradegoods (10), Mecatol Rex (7)");
});

it("_getPlayerSlotWithFactionUnit", () => {
  const buildConsume: BuildConsume = new BuildConsume([], []);
  const unit: string = "unit:base/letani-warrior";

  expect(buildConsume._getPlayerSlotWithFactionUnit(unit)).toBe(-1);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });
  MockGameObject.simple("sheet.faction:base/arborec");

  expect(new Find().closestOwnedCardHolderOwner([0, 0, 0])).toBe(1);
  expect(globalThis.TI4.factionRegistry.getByPlayerSlot(1)).toBeDefined();

  expect(buildConsume._getPlayerSlotWithFactionUnit(unit)).toBe(1);
});

it("_getSpaceDockPlanetNames", () => {
  const buildConsume: BuildConsume = new BuildConsume([], []);

  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/space-dock", { owningPlayerSlot: 1 });

  const planetNames: Set<string> = buildConsume._getSpaceDockPlanetNames(1);
  expect(planetNames.size).toBe(1);
  expect(planetNames.has("Jord")).toBe(true);
});
