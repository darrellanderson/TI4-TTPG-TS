import { UnitAttrsRegistry } from "./unit-attrs-registry";

it("constructor", () => {
  new UnitAttrsRegistry();
});

it("load (empty)", () => {
  const registry = new UnitAttrsRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const nsid = "card.technology.unit-upgrade:my-source/my-nsid-name-2";

  const registry = new UnitAttrsRegistry();
  expect(registry.rawByUnit("infantry")).toBeUndefined();
  expect(registry.rawByNsid(nsid)).toBeUndefined();

  registry.load("my-source", [
    {
      name: "my-base-name",
      unit: "infantry",
    },
    {
      name: "my-override-name",
      unit: "infantry",
      nsidName: "my-nsid-name-2",
    },
  ]);
  expect(registry.rawByUnit("infantry")?.name).toBe("my-base-name");
  expect(registry.rawByNsid(nsid)?.name).toBe("my-override-name");
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
  const nsid1 = "fighter:base/hybrid-crystal-fighter";
  const nsid2 = "card.technology.unit-upgrade:base/hybrid-crystal-fighter-2";

  const registry = new UnitAttrsRegistry();
  expect(registry.rawByUnit("fighter")).toBeUndefined();
  expect(registry.rawByNsid(nsid1)).toBeUndefined();
  expect(registry.rawByNsid(nsid2)).toBeUndefined();
  expect(registry.getAllBaseAttrs()).toHaveLength(0);
  expect(registry.rawByUnit("mech")).toBeUndefined();

  registry.loadDefaultData();
  expect(registry.rawByNsid(nsid1)).toBeDefined();
  expect(registry.rawByNsid(nsid2)).toBeDefined();
  expect(registry.getAllBaseAttrs()).not.toHaveLength(0);
  expect(registry.rawByUnit("mech")).toBeDefined();
});
