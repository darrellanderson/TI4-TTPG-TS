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
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "action",
        nsidName: "my-nsid-name",
      },
    ],
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
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "action",
        nsidName: "my-nsid-name",
      },
    ],
  };
  const nsid: string = "card.action:my-source/my-nsid-name";

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getByNsid(nsid)).toBeUndefined();
  expect(registry.getByNsidName("my-nsid-name")).toBeUndefined();

  registry.load(source, [schema]);
  expect(registry.getByNsid(nsid)).toBeDefined();
  expect(registry.getByNsid(nsid)?.getName()).toBe("my-name");
  expect(registry.getByNsidName("my-nsid-name")?.getName()).toBe("my-name");
});

it("load", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(
    registry.load("source", [
      { name: "my-name", owner: "self", priority: "mutate" },
    ])
  ).toBeInstanceOf(UnitModifierRegistry);
});

it("load (invalid)", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(() => {
    registry.load("source", [
      {
        name: "my-name",
        triggers: [{ nsidName: "@@invalid" }],
        owner: "self",
        priority: "mutate",
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  registry.loadDefaultData();
});
