import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { UnitModifier } from "../unit-modifier/unit-modifier";
import { UnitModifierRegistry } from "./unit-modifier-registry";

it("constructor", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry).toBeInstanceOf(UnitModifierRegistry);
});

it("getAll", () => {
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
    applies: (x: string): boolean => {
      return true;
    },
    apply: (x: number): void => {},
  };

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getAll().length).toBe(0);

  registry.load(source, [schema]);
  expect(registry.getAll().length).toBe(1);
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
    applies: (x: string): boolean => {
      return true;
    },
    apply: (x: number): void => {},
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
        applies: (x: string): boolean => {
          return true;
        },
        apply: (x: number): void => {},
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
        applies: (x: string): boolean => {
          return true;
        },
        apply: (x: number): void => {},
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  registry.loadDefaultData();
});
