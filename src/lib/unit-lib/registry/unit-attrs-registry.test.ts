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
  expect(registry.rawByUnit("infantry")).toBeUndefined();
  expect(registry.rawByNsidName("my-nsid-name")).toBeUndefined();

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
  expect(registry.rawByUnit("infantry")?.name).toBe("my-base-name");
  expect(registry.rawByNsidName("my-nsid-name")?.name).toBe("my-override-name");
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
  const nsidName = "hybrid-crystal-fighter";
  const nsid = "card.technology.unit-upgrade:base/hybrid-crystal-fighter";

  const registry = new UnitAttrsRegistry();
  expect(registry.rawByUnit("fighter")).toBeUndefined();
  expect(registry.rawByNsidName(nsidName)).toBeUndefined();
  expect(registry.rawByNsid(nsid)).toBeUndefined();
  expect(registry.getAllBaseAttrs()).toHaveLength(0);
  expect(registry.rawByUnit("mech")).toBeUndefined();

  registry.loadDefaultData();
  expect(registry.rawByNsidName(nsidName)).toBeDefined();
  expect(registry.rawByNsid(nsid)).toBeDefined();
  expect(registry.getAllBaseAttrs()).not.toHaveLength(0);
  expect(registry.rawByUnit("mech")).toBeDefined();
});
