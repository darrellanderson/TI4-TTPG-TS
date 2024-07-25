import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { UnitModifierRegistry } from "./unit-modifier-registry";

it("constructor", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry).toBeInstanceOf(UnitModifierRegistry);
});

it("getAllWithNsids", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "action",
        nsidName: "my-nsid-name",
      },
    ],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getAllWithNsids().length).toBe(0);

  registry.load(source, [schema]);
  expect(registry.getAllWithNsids().length).toBe(1);
});

it("getAlways", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggerAlways: true,
    triggers: [],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getAllWithNsids().length).toBe(0);

  registry.load(source, [schema]);
  expect(registry.getAlways().length).toBe(1);
});

it("getByNsid", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "action",
        nsidName: "my-nsid-name",
      },
    ],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };
  const nsid: string = "card.action:my-source/my-nsid-name";

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getByNsid(nsid)).toBeUndefined();

  registry.load(source, [schema]);
  expect(registry.getByNsid(nsid)).toBeDefined();
  expect(registry.getByNsid(nsid)?.getName()).toBe("my-name");
});

it("load", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(
    registry.load("source", [
      {
        name: "my-name",
        description: "my-description",
        owner: "self",
        priority: "mutate",
        triggers: [],
        applies: (_x: CombatRoll): boolean => {
          return true;
        },
        apply: (_x: CombatRoll): void => {},
      },
    ])
  ).toBeInstanceOf(UnitModifierRegistry);
});

it("load (invalid)", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(() => {
    registry.load("source", [
      {
        name: "my-name",
        description: "my-description",
        triggers: [{ cardClass: "action", nsidName: "@@invalid" }],
        owner: "self",
        priority: "mutate",
        applies: (_x: CombatRoll): boolean => {
          return true;
        },
        apply: (_x: CombatRoll): void => {},
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  registry.loadDefaultData();
});

it("validateOrThrow", () => {
  TI4.unitModifierRegistry.validateOrThrow();
});
