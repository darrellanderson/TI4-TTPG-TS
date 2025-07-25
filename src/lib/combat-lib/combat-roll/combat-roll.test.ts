import { Card, Player, Vector } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockVector,
} from "ttpg-mock";
import { CardUtil, DiceParams, DiceResult } from "ttpg-darrell";

import { CombatAttrs } from "../../unit-lib/unit-attrs/combat-attrs";
import {
  BestUnitWithCombatAttrs,
  CombatRoll,
  CombatRollParams,
  CombatRollPerPlayerData,
} from "./combat-roll";
import { Faction } from "../../faction-lib/faction/faction";
import { Planet } from "../../system-lib/planet/planet";
import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
import { System } from "../../system-lib/system/system";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";
import { UnitModifierActiveIdle } from "../../unit-lib/unit-modifier/unit-modifier-active-idle";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";

it("data addSyntheticUnit", () => {
  const data: CombatRollPerPlayerData = new CombatRollPerPlayerData();
  expect(data.getCount("my-unit" as UnitType)).toBe(0);
  expect(data.hasUnit("my-unit" as UnitType)).toBe(false);
  expect(data.hasUnitAdj("my-unit" as UnitType)).toBe(false);

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
    2
  );
  expect(success).toBe(true);
  expect(data.overrideUnitCountHex.get("my-unit" as UnitType)).toBe(2);
  expect(data.getCount("my-unit" as UnitType)).toBe(2);
  expect(data.hasUnit("my-unit" as UnitType)).toBe(true);
  expect(data.hasUnitAdj("my-unit" as UnitType)).toBe(false);
});

it("data hasUnit", () => {
  const data: CombatRollPerPlayerData = new CombatRollPerPlayerData();
  expect(data.hasUnit("infantry")).toBe(false);
  expect(data.hasUnit("fighter")).toBe(false);

  data.unitPlasticHex.push(
    new UnitPlastic(
      "infantry",
      1,
      new MockGameObject(),
      new MockVector(0, 0, 0)
    )
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
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  const combatRoll: CombatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.getRollType()).toBe("spaceCombat");
});

it("constructor", () => {
  const params: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  expect(combatRoll.getRollType()).toBe("spaceCombat");
  expect(combatRoll.getActivatingPlayerSlot()).toBe(1);
});

it("_getCombatAttrs (spaceCannonOffense)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });
  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect(unitToCombatAttrs.get("carrier")).toBeUndefined();
  expect(unitToCombatAttrs.get("destroyer")).toBeUndefined();
  expect(unitToCombatAttrs.get("dreadnought")).toBeUndefined();
  expect(unitToCombatAttrs.get("infantry")).toBeUndefined();
  expect(unitToCombatAttrs.get("pds")).toBeDefined();
});

it("_getCombatAttrs (antiFighterBarrage)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });
  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect(unitToCombatAttrs.get("carrier")).toBeUndefined();
  expect(unitToCombatAttrs.get("destroyer")).toBeDefined();
  expect(unitToCombatAttrs.get("dreadnought")).toBeUndefined();
  expect(unitToCombatAttrs.get("infantry")).toBeUndefined();
  expect(unitToCombatAttrs.get("pds")).toBeUndefined();
});

it("_getCombatAttrs (spaceCombat)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });
  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect(unitToCombatAttrs.get("carrier")).toBeDefined();
  expect(unitToCombatAttrs.get("destroyer")).toBeDefined();
  expect(unitToCombatAttrs.get("dreadnought")).toBeDefined();
  expect(unitToCombatAttrs.get("infantry")).toBeUndefined();
  expect(unitToCombatAttrs.get("pds")).toBeUndefined();
});

it("_getCombatAttrs (bombardment)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });
  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect(unitToCombatAttrs.get("carrier")).toBeUndefined();
  expect(unitToCombatAttrs.get("destroyer")).toBeUndefined();
  expect(unitToCombatAttrs.get("dreadnought")).toBeDefined();
  expect(unitToCombatAttrs.get("infantry")).toBeUndefined();
  expect(unitToCombatAttrs.get("pds")).toBeUndefined();
});

it("_getCombatAttrs (spaceCannonDefense)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });
  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect(unitToCombatAttrs.get("carrier")).toBeUndefined();
  expect(unitToCombatAttrs.get("destroyer")).toBeUndefined();
  expect(unitToCombatAttrs.get("dreadnought")).toBeUndefined();
  expect(unitToCombatAttrs.get("infantry")).toBeUndefined();
  expect(unitToCombatAttrs.get("pds")).toBeDefined();
});

it("_getCombatAttrs (groundCombat)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "groundCombat",
    planetName: "Jord",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1,
  });
  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect(combatRoll.getPlanetName()).toBe("Jord");
  expect(unitToCombatAttrs.get("carrier")).toBeUndefined();
  expect(unitToCombatAttrs.get("destroyer")).toBeUndefined();
  expect(unitToCombatAttrs.get("dreadnought")).toBeUndefined();
  expect(unitToCombatAttrs.get("infantry")).toBeDefined();
  expect(unitToCombatAttrs.get("pds")).toBeUndefined();
});

it("_findUnitPlastic", () => {
  MockGameObject.simple("unit:base/fighter");
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("tile.system:base/1", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
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
    rollType: "spaceCombat",
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
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-self-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
    {
      name: "my-opponent-modifier",
      description: "my-description",
      owner: "opponent",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-opponent-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  MockCard.simple("card.action:my-source/my-self-nsid-name");
  MockCard.simple("card.action:my-source/my-opponent-nsid-name", {
    position: opponentPos,
  });

  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
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
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier-name",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-action" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  const nsid: string = "card.action:my-source/my-action";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();

  const params: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);

  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });
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
  expect(names).toEqual(["my-modifier-name"]);
});

it("_findUnitModifiers (active/idle)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier-name",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      isActiveIdle: true,
      triggers: [{ cardClass: "action", nsidName: "my-action" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  const nsid: string = "card.action:my-source/my-action";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();

  const params: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);

  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });
  const card: Card = MockCard.simple(nsid);
  expect(card.isFaceUp()).toBe(true);
  const allowFaceDown: boolean = false;
  const rejectSnapPointTags: Array<string> = [];
  expect(
    new CardUtil().isLooseCard(card, allowFaceDown, rejectSnapPointTags)
  ).toBe(true);

  let unitModifiers: Array<UnitModifier>;
  let names: Array<string>;
  unitModifiers = combatRoll._findUnitModifiers(2, 1);
  names = unitModifiers.map((modifier) => modifier.getName());
  expect(names).toEqual([]);

  UnitModifierActiveIdle.setActive(card, true);
  unitModifiers = combatRoll._findUnitModifiers(2, 1);
  names = unitModifiers.map((modifier) => modifier.getName());
  expect(names).toEqual(["my-modifier-name"]);
});

it("_findUnitModifiers (self faction promissory)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier-name",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "promissory", nsidName: "my-test-promissory" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  const nsid: string = "card.promissory:my-source/my-test-promissory";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();

  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: ["my-test-promissory"],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: [],
  });
  expect(faction.getPromissoryNsids().includes(nsid)).toBe(true);

  const params: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideSelfFaction: faction,
  };
  const combatRoll: CombatRoll = new CombatRoll(params).applyFactions();
  expect(combatRoll.self.faction).toBe(faction);

  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });
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
  expect(names).toEqual([]);
});

it("_findUnitModifiers (control token)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "agenda", nsidName: "my-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  MockCard.simple("card.agenda:my-source/my-nsid-name");
  MockGameObject.simple("token.control:base/sol", { owningPlayerSlot: 2 });

  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);

  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 1,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("_findUnitModifiers (atop apply to all)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "agenda", nsidName: "my-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  MockCard.simple("card.agenda:my-source/my-nsid-name");

  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  MockCard.simple("test:test/atopApplyToAll");
  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);
});

it("_findUnitModifiers (atop ignore)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "agenda", nsidName: "my-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  MockCard.simple("card.agenda:my-source/my-nsid-name");

  new MockCardHolder({ owningPlayerSlot: 2 });

  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);

  MockCard.simple("test:test/atopIgnore");
  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("_findUnitModifiers (faction ability)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: ["my-ability"],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: [],
  });

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "faction-ability", nsidName: "my-ability" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideSelfFaction: faction,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);
});

it("_findUnitModifiers (faction ability opponent)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: ["my-ability"],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [""],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: [],
  });

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "opponent",
      priority: "mutate",
      triggers: [{ cardClass: "faction-ability", nsidName: "my-ability" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideOpponentFaction: faction,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);
});

it("_findUnitModifiers (flagship)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: ["my-test-promissory"],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: ["my-flagship"],
  });
  TI4.unitAttrsRegistry.load("my-source", [
    { unit: "flagship", name: "my-flagship-name", nsidName: "my-flagship" },
  ]);

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "unit", nsidName: "my-flagship" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);

  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/flagship", { owningPlayerSlot: 2 });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideSelfFaction: faction,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);
});

it("_findUnitModifiers (flagship opponent)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: ["my-flagship"],
  });
  TI4.unitAttrsRegistry.load("my-source", [
    { unit: "flagship", name: "my-flagship-name", nsidName: "my-flagship" },
  ]);

  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "opponent",
      priority: "mutate",
      triggers: [{ cardClass: "unit", nsidName: "my-flagship" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);

  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/flagship", { owningPlayerSlot: 1 });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideOpponentFaction: faction,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);
});

it("applyUnitOverrides", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });
  MockCard.simple("card.technology.unit-upgrade:base/carrier-2");

  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
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

it("applyUnitOverrides (flagship)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: ["my-flagship"],
  });

  TI4.unitAttrsRegistry.load("my-source", [
    {
      unit: "flagship",
      name: "my-flagship-name",
      nsidName: "my-flagship",
    },
  ]);

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideSelfFaction: faction,
  });
  expect(combatRoll.self.unitAttrsSet.get("flagship")?.getName()).toBe(
    "my-flagship-name"
  );
});

it("applyUnitOverrides (flagship opponent)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const faction: Faction = new Faction(sourceAndPackageId, {
    nsidName: "my-faction",
    name: "My Faction",
    abbr: "MF",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: ["one", "two"],
    startingUnits: {},
    factionTechs: [],
    unitOverrides: ["my-flagship"],
  });

  TI4.unitAttrsRegistry.load("my-source", [
    {
      unit: "flagship",
      name: "my-flagship-name",
      nsidName: "my-flagship",
    },
  ]);
  expect(
    TI4.unitAttrsRegistry.rawByNsid("unit:my-source/my-flagship")
  ).toBeDefined();

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
    overrideOpponentFaction: faction,
  });
  expect(combatRoll.opponent.playerSlot).toBe(1);
  expect(combatRoll.opponent.unitAttrsSet.get("flagship")?.getName()).toBe(
    "my-flagship-name"
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
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {},
    },
  ]);
  MockCard.simple("card.action:my-source/my-self-nsid-name");

  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
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
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-self-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (_combatRoll: CombatRoll): void => {
        throw new Error("buggy modifier");
      },
    },
  ]);
  MockCard.simple("card.action:my-source/my-self-nsid-name");

  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
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
    rollType: "spaceCombat", // only looks at ships
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1, // active player
  });
  expect(combatRoll.opponent.playerSlot).toBe(-1);

  combatRoll.applyUnitPlasticAndSetOpponentPlayerSlot();
  expect(combatRoll.opponent.playerSlot).toBe(3);
});

it("applyUnitPlastic (assign opponent player slot, ground)", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 3 });
  MockGameObject.simple("unit:base/infantry", { owningPlayerSlot: 4 });

  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "groundCombat", // only looks at ground
    planetName: "Jord",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 1, // active player
  });
  expect(combatRoll.opponent.playerSlot).toBe(-1);

  combatRoll.applyUnitPlasticAndSetOpponentPlayerSlot();
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
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 1,
  });

  expect(combatRoll.self.unitPlasticHex.length).toBe(0);
  expect(combatRoll.self.unitPlasticAdj.length).toBe(0);
  expect(combatRoll.opponent.unitPlasticHex.length).toBe(0);
  expect(combatRoll.opponent.unitPlasticAdj.length).toBe(0);

  combatRoll.applyUnitPlasticAndSetOpponentPlayerSlot();
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

it("bestHitUnitWithCombatAttrs", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  combatRoll.self.overrideUnitCountHex.set("carrier", 1);
  combatRoll.self.overrideUnitCountHex.set("dreadnought", 1);
  const best: BestUnitWithCombatAttrs | undefined =
    combatRoll.bestHitUnitWithCombatAttrs();
  expect(best?.unit).toBe("dreadnought");
  expect(best?.combatAttrs.getHit()).toBe(5);
});

it("bestHitCombatAttrs (none)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  const best: BestUnitWithCombatAttrs | undefined =
    combatRoll.bestHitUnitWithCombatAttrs();
  expect(best).toBeUndefined();
});

it("createDiceParamsArray (no units)", () => {
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  const diceParamsArray: Array<DiceParams> = combatRoll.createDiceParamsArray();
  expect(diceParamsArray.length).toBe(0);
});

it("createDiceParamsArray (space)", () => {
  MockGameObject.simple("tile/system:base/1");
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/infantry", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/mech", { owningPlayerSlot: 2 });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  const diceParamsArray: Array<DiceParams> = combatRoll.createDiceParamsArray();
  expect(diceParamsArray).toEqual([
    {
      hit: 9,
      id: "carrier",
      name: "Carrier",
      primaryColor: { a: 1, b: 1, g: 0, r: 0 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
    {
      hit: 9,
      id: "fighter",
      name: "Fighter",
      primaryColor: { a: 1, b: 1, g: 1, r: 0 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
    {
      hit: 9,
      id: "fighter",
      name: "Fighter",
      primaryColor: { a: 1, b: 1, g: 1, r: 0 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
  ]);
});

it("_pruneToUnitsClosestToPlanet", () => {
  MockGameObject.simple("tile.system:base/9");
  const system: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  if (!system) {
    throw new Error("system not found"); // TypeScript
  }
  const yesPlanet: Planet | undefined = system.getPlanets()[0];
  const noPlanet: Planet | undefined = system.getPlanets()[1];
  if (!yesPlanet) {
    throw new Error("planet not found"); // TypeScript
  }
  if (!noPlanet) {
    throw new Error("planet not found"); // TypeScript
  }

  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 2,
    position: yesPlanet.getPosition(),
  });
  MockGameObject.simple("unit:pok/mech", {
    owningPlayerSlot: 2,
    position: noPlanet.getPosition(),
  });
  MockGameObject.simple("unit:pok/mech", {
    owningPlayerSlot: 1,
    position: yesPlanet.getPosition(),
  });
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 1,
    position: noPlanet.getPosition(),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: yesPlanet.getName(),
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.planet).toBe(yesPlanet);
  expect(combatRoll.self.getCount("infantry")).toBe(1);
  expect(combatRoll.self.getCount("mech")).toBe(1);
  expect(combatRoll.opponent.getCount("infantry")).toBe(1);
  expect(combatRoll.opponent.getCount("mech")).toBe(1);

  combatRoll._pruneToUnitsClosestToPlanet();
  expect(combatRoll.self.getCount("infantry")).toBe(1);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.opponent.getCount("infantry")).toBe(0);
  expect(combatRoll.opponent.getCount("mech")).toBe(1);
});

it("_checkCancelBombardment", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll._checkCancelBombardment()).toBe(false);

  // PDS grants planetary shield.
  combatRoll.opponent.overrideUnitCountHex.set("pds", 1);
  expect(combatRoll._checkCancelBombardment()).toBe(true);
  expect(combatRoll.createDiceParamsArray()).toEqual([]);

  // War suns disable planetary shield.
  combatRoll.self.overrideUnitCountHex.set("war-sun", 1);
  expect(combatRoll._checkCancelBombardment()).toBe(false);
});

it("createDiceParamsArray (ground)", () => {
  MockGameObject.simple("tile.system:base/9");
  const system: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  if (!system) {
    throw new Error("system not found"); // TypeScript
  }
  const yesPlanet: Planet | undefined = system.getPlanets()[0];
  const noPlanet: Planet | undefined = system.getPlanets()[1];
  if (!yesPlanet) {
    throw new Error("planet not found"); // TypeScript
  }
  if (!noPlanet) {
    throw new Error("planet not found"); // TypeScript
  }

  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 2,
    position: yesPlanet.getPosition(),
  });
  MockGameObject.simple("unit:pok/mech", {
    owningPlayerSlot: 2,
    position: noPlanet.getPosition(),
  });
  MockGameObject.simple("unit:pok/mech", {
    owningPlayerSlot: 1,
    position: yesPlanet.getPosition(),
  });
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 1,
    position: noPlanet.getPosition(),
  });

  let combatRoll: CombatRoll;
  let diceParamsArray: Array<DiceParams>;

  // Roll 2 vs 1.
  combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: yesPlanet.getName(),
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  diceParamsArray = combatRoll.createDiceParamsArray();
  expect(diceParamsArray).toEqual([
    {
      hit: 8,
      id: "infantry",
      name: "Infantry",
      primaryColor: { a: 1, b: 0, g: 1, r: 0 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
  ]);

  // Roll 1 vs 2.
  combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: yesPlanet.getName(),
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 1,
  });
  diceParamsArray = combatRoll.createDiceParamsArray();
  expect(diceParamsArray).toEqual([
    {
      hit: 13,
      id: "mech",
      name: "Mech",
      primaryColor: { a: 1, b: 0, g: 0, r: 0 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
  ]);
});

it("createDiceParamsArray (range, crit)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier",
      description: "my-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-nsid-name" }],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (combatRoll: CombatRoll): void => {
        const pds: UnitAttrs | undefined =
          combatRoll.self.unitAttrsSet.get("pds");
        if (!pds) {
          throw new Error("missing pds");
        }
        const combatAttrs: CombatAttrs | undefined = pds.getSpaceCannon();
        if (!combatAttrs) {
          throw new Error("missing combatAttrs");
        }
        combatAttrs.setRange(1);
        combatAttrs.setCrit(9);
        combatAttrs.setCritCount(4);
      },
    },
  ]);
  new MockCardHolder({ owningPlayerSlot: 2 });
  MockCard.simple("card.action:my-source/my-nsid-name");
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("tile.system:base/2", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("unit:base/pds", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/pds", {
    owningPlayerSlot: 2,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<1,0,-1>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["my-modifier"]);
  const diceParamsArray: Array<DiceParams> = combatRoll.createDiceParamsArray();
  expect(diceParamsArray).toEqual([
    {
      crit: 9,
      critCount: 4,
      hit: 6,
      id: "pds",
      name: "PDS",
      primaryColor: { a: 1, b: 0, g: 0.5, r: 1 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
    {
      crit: 9,
      critCount: 4,
      hit: 6,
      id: "pds",
      name: "PDS",
      primaryColor: { a: 1, b: 0, g: 0.5, r: 1 },
      reroll: false,
      secondaryColor: { a: 1, b: 1, g: 1, r: 1 },
      sides: 10,
    },
  ]);
});

it("roll", () => {
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  });
  const player: Player = new MockPlayer();
  const position: Vector = new Vector(0, 0, 0);
  combatRoll.roll(player, position);
});

it("opponent has anonymous units", () => {
  MockGameObject.simple("tile/system:base/1");
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 2 });
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 19 });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 2,
  });
  expect(combatRoll.opponent.playerSlot).toBe(19);
  expect(combatRoll.opponent.getCount("carrier")).toBe(1);

  const rollingPlayerSlots: Array<number> = [];
  TI4.events.onCombatResult.add(
    (resultCombatRoll: CombatRoll, _diceResults: Array<DiceResult>): void => {
      rollingPlayerSlots.push(resultCombatRoll.self.playerSlot);
    }
  );
  expect(rollingPlayerSlots).toEqual([]);

  const player: Player = new MockPlayer({ slot: 2 });
  const position: Vector = new MockVector(0, 0, 0);
  combatRoll.roll(player, position);

  expect(rollingPlayerSlots).toEqual([2, 19]);
});
