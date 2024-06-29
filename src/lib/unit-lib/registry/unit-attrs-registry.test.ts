import { UnitAttrsRegistry } from "./unit-attrs-registry";

it("constructor", () => {
  new UnitAttrsRegistry();
});

it("load (empty)", () => {
  const registry = new UnitAttrsRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const registry = new UnitAttrsRegistry();
  expect(registry.getBaseAttrs("infantry")).toBeUndefined();
  expect(registry.getOverrideAttrs("my-nsid-name")).toBeUndefined();

  registry.load("source", [
    {
      name: "my-base-name",
      unit: "infantry",
    },
    {
      name: "my-override-name",
      unit: "infantry",
      nsidName: "my-nsid-name",
    },
  ]);
  expect(registry.getBaseAttrs("infantry")?.name).toBe("my-base-name");
  expect(registry.getOverrideAttrs("my-nsid-name")?.name).toBe(
    "my-override-name"
  );
});

it("load (invalid schema)", () => {
  const registry = new UnitAttrsRegistry();
  expect(() => {
    registry.load("source", [
      {
        name: "my-base-name",
        unit: "infantry",
        nsidName: "@@invalid",
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry = new UnitAttrsRegistry();
  expect(registry.getBaseAttrs("fighter")).toBeUndefined();
  expect(registry.getOverrideAttrs("hybrid-crystal-fighter")).toBeUndefined();
  expect(registry.getAllBaseAttrs()).toHaveLength(0);

  registry.loadDefaultData();
  expect(registry.getBaseAttrs("fighter")).toBeDefined();
  expect(registry.getOverrideAttrs("hybrid-crystal-fighter")).toBeDefined();
  expect(registry.getAllBaseAttrs()).not.toHaveLength(0);
});

it("createUnitAttrsSet", () => {
  const unitAttrsSet = new UnitAttrsRegistry()
    .loadDefaultData()
    .createUnitAttrsSet(["fighter-2"]);
  expect(unitAttrsSet.get("infantry")?.getName()).toBe("Infantry");
  expect(unitAttrsSet.get("fighter")?.getName()).toBe("Fighter II");
});
