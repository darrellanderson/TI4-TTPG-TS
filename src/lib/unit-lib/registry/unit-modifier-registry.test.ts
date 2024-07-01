import { UnitModifierRegistry } from "./unit-modifier-registry";

it("constructor", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry).toBeInstanceOf(UnitModifierRegistry);
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
