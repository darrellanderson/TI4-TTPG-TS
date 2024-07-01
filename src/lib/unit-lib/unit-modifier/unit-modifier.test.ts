import { UnitModifier } from "./unit-modifier";

it("constructor", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    owner: "self",
    priority: "mutate",
  });
  expect(unitModifier.getDescription()).toBeUndefined();
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getNsidNames()).toEqual([]);
  expect(unitModifier.getOwner()).toBe("self");
  expect(unitModifier.getPriority()).toBe("mutate");
  expect(unitModifier.isActiveIdle()).toBe(false);
  expect(unitModifier.isCombat()).toBe(false);
});

it("constructor (with optional fields)", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    owner: "self",
    priority: "mutate",
    description: "my-description",
    nsidNames: ["my-nsid-name"],
    isActiveIdle: true,
    isCombat: true,
  });
  expect(unitModifier.getDescription()).toBe("my-description");
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getNsidNames()).toEqual(["my-nsid-name"]);
  expect(unitModifier.getOwner()).toBe("self");
  expect(unitModifier.getPriority()).toBe("mutate");
  expect(unitModifier.isActiveIdle()).toBe(true);
  expect(unitModifier.isCombat()).toBe(true);
});
