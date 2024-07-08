import { Card, Vector } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { CardUtil } from "ttpg-darrell";

import {
  CombatRoll,
  CombatRollParams,
  CombatRollPerPlayerData,
} from "./combat-roll";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../unit-lib/schema/unit-attrs-schema";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
import exp from "constants";

it("data addSyntheticUnit", () => {
  const data: CombatRollPerPlayerData = new CombatRollPerPlayerData();
  expect(data.hasUnit("my-unit" as UnitType)).toBe(false);

  let success: boolean;
  success = data.addSyntheticUnit(
    {
      name: "my-name",
      unit: "infantry",
    },
    1
  );
  expect(success).toBe(false);

  success = data.addSyntheticUnit(
    {
      name: "my-name",
      unit: "my-unit" as UnitType,
    },
    1
  );
  expect(success).toBe(true);
  expect(data.overrideUnitCountHex.get("my-unit" as UnitType)).toBe(1);
  expect(data.hasUnit("my-unit" as UnitType)).toBe(true);
});

it("data hasUnit", () => {
  const data: CombatRollPerPlayerData = new CombatRollPerPlayerData();
  expect(data.hasUnit("infantry")).toBe(false);
  expect(data.hasUnit("fighter")).toBe(false);

  data.unitPlasticHex.push(
    new UnitPlastic("infantry", 1, new MockGameObject())
  );
  expect(data.hasUnit("infantry")).toBe(true);
  expect(data.hasUnit("fighter")).toBe(false);

  data.overrideUnitCountHex.set("infantry", 0);
  data.overrideUnitCountHex.set("fighter", 1);
  expect(data.hasUnit("infantry")).toBe(false);
  expect(data.hasUnit("fighter")).toBe(true);
});

it("static createCooked", () => {
  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  const combatRoll: CombatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.getType()).toBe("spaceCombat");
});

it("constructor", () => {
  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  expect(combatRoll.getType()).toBe("spaceCombat");
});

it("_findUnitPlastic", () => {
  MockGameObject.simple("unit:base/fighter");
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("tile.system:base/1", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<1,0,-1>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });

  const unitPlastics: Array<UnitPlastic> = combatRoll._findUnitPlastics();
  expect(unitPlastics[0]?.getUnit()).toBe("fighter");
});

it("_findUnitAttrOverrides (standard unit upgrade)", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);

  const nsid: string = "card.technology.unit-upgrade:base/carrier-2";
  expect(TI4.unitAttrsRegistry.rawByNsid(nsid)).toBeDefined();

  const card: Card = MockCard.simple(nsid);
  expect(card.isFaceUp()).toBe(true);
  const allowFaceDown: boolean = false;
  const rejectSnapPointTags: Array<string> = [];
  expect(
    new CardUtil().isLooseCard(card, allowFaceDown, rejectSnapPointTags)
  ).toBe(true);

  const overrides: Array<UnitAttrsSchemaType> =
    combatRoll._findUnitAttrOverrides(2);
  const names: Array<string> = overrides.map((override) => override.name);
  expect(names).toEqual(["Carrier II"]);
});

it("_findUnitModifiers (self, opponent)", () => {
  // Need a card holder to be closest to assign cards.
  const opponentPos: Vector = new Vector(9, 0, 0);
  new MockCardHolder({ owningPlayerSlot: 2 });
  new MockCardHolder({ owningPlayerSlot: 3, position: opponentPos });

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-self-modifier",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-self-nsid-name" }],
    },
    {
      name: "my-opponent-modifier",
      owner: "opponent",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-opponent-nsid-name" }],
    },
  ]);
  MockCard.simple("card.action:my-source/my-self-nsid-name");
  MockCard.simple("card.action:my-source/my-opponent-nsid-name", {
    position: opponentPos,
  });

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 3,
    rollingPlayerSlot: 2,
  });
  const unitModifiers: Array<UnitModifier> = combatRoll._findUnitModifiers(
    2,
    3
  );
  const names: Array<string> = unitModifiers.map((modifier) =>
    modifier.getName()
  );
  expect(names).toEqual(["my-self-modifier", "my-opponent-modifier"]);
});

it("_findUnitModifiers", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);

  const nsid: string = "card.leader.commander:pok/2ram";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();

  const card: Card = MockCard.simple(nsid);
  expect(card.isFaceUp()).toBe(true);
  const allowFaceDown: boolean = false;
  const rejectSnapPointTags: Array<string> = [];
  expect(
    new CardUtil().isLooseCard(card, allowFaceDown, rejectSnapPointTags)
  ).toBe(true);

  const unitModifiers: Array<UnitModifier> = combatRoll._findUnitModifiers(
    2,
    1
  );
  const names: Array<string> = unitModifiers.map((modifier) =>
    modifier.getName()
  );
  expect(names).toEqual(["2Ram"]);
});

it("applyUnitOverrides", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });
  MockCard.simple("card.technology.unit-upgrade:base/carrier-2");

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.self.unitAttrsSet.get("carrier")?.getName()).toBe(
    "Carrier"
  );

  combatRoll.applyUnitOverries();
  expect(combatRoll.self.unitAttrsSet.get("carrier")?.getName()).toBe(
    "Carrier II"
  );
});

it("applyUnitModifiers", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-self-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-self-nsid-name" }],
    },
  ]);
  MockCard.simple("card.action:my-source/my-self-nsid-name");

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  combatRoll.applyUnitModifiersOrThrow();

  expect(combatRoll.getUnitModifierNames()).toEqual(["my-self-modifier"]);
  expect(combatRoll.getUnitModifierNamesWithDescriptions()).toEqual([
    "my-self-modifier (my-description)",
  ]);
});

it("applyUnitModifiers (modifier throws)", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-self-modifier",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-self-nsid-name" }],
      apply: (combatRoll: CombatRoll): void => {
        throw new Error("buggy modifier");
      },
    },
  ]);
  MockCard.simple("card.action:my-source/my-self-nsid-name");

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });

  expect(() => {
    combatRoll.applyUnitModifiersOrThrow();
  }).toThrow();
});

it("applyUnitPlastic (assign opponent player slot, space)", () => {
  MockGameObject.simple("unit:base/infantry", { owningPlayerSlot: 4 });
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 3 });

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat", // only looks at ships
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1, // active player
  });
  expect(combatRoll.opponent.playerSlot).toBe(-1);

  combatRoll.applyUnitPlastic();
  expect(combatRoll.opponent.playerSlot).toBe(3);
});

it("applyUnitPlastic (assign opponent player slot, ground)", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 3 });
  MockGameObject.simple("unit:base/infantry", { owningPlayerSlot: 4 });

  const combatRoll: CombatRoll = new CombatRoll({
    type: "groundCombat", // only looks at ground
    planetName: "Jord",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1, // active player
  });
  expect(combatRoll.opponent.playerSlot).toBe(-1);

  combatRoll.applyUnitPlastic();
  expect(combatRoll.opponent.playerSlot).toBe(4);
});

it("applyUnitPlastic (assign units)", () => {
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 1 });
  MockGameObject.simple("unit:base/cruiser", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 1,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("unit:base/dreadnought", {
    owningPlayerSlot: 2,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("tile.system:base/1", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 1,
  });

  expect(combatRoll.self.unitPlasticHex.length).toBe(0);
  expect(combatRoll.self.unitPlasticAdj.length).toBe(0);
  expect(combatRoll.opponent.unitPlasticHex.length).toBe(0);
  expect(combatRoll.opponent.unitPlasticAdj.length).toBe(0);

  combatRoll.applyUnitPlastic();
  expect(combatRoll.self.unitPlasticHex.map((x) => x.getUnit())).toEqual([
    "carrier",
  ]);
  expect(combatRoll.opponent.unitPlasticHex.map((x) => x.getUnit())).toEqual([
    "cruiser",
  ]);
  expect(combatRoll.self.unitPlasticAdj.map((x) => x.getUnit())).toEqual([
    "destroyer",
  ]);
  expect(combatRoll.opponent.unitPlasticAdj.map((x) => x.getUnit())).toEqual([
    "dreadnought",
  ]);
});
