import { Card, Vector } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { CardUtil } from "ttpg-darrell";

import { CombatRoll, CombatRollParams } from "./combat-roll";
import { UnitAttrsSchemaType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";
import { UnitPlastic } from "lib/unit-lib/unit-plastic/unit-plastic";

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
