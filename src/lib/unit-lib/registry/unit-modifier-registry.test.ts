import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { UnitModifier } from "../unit-modifier/unit-modifier";
import { UnitModifierRegistry } from "./unit-modifier-registry";

it("constructor", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry).toBeInstanceOf(UnitModifierRegistry);
});

it("rawByNsid", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    owner: "self",
    priority: "mutate",
    nsidName: "my-nsid-name",
    cardClass: "action",
  };
  const nsid: string | undefined = UnitModifier.schemaToNsid(source, schema);
  expect(nsid).toBe("card.action:my-source/my-nsid-name");
  if (!nsid) {
    throw new Error("nsid is undefined"); // for TypeScript
  }

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.rawByNsid(nsid)).toBeUndefined();

  registry.load(source, [schema]);
  expect(registry.rawByNsid(nsid)).toBe(schema);
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
        nsidName: "@@invalid",
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
