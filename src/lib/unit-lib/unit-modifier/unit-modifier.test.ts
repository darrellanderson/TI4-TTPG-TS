import exp from "constants";
import { UnitModifier } from "./unit-modifier";

it("constructor", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    owner: "self",
    priority: "mutate",
  });
  expect(unitModifier.getCardClass()).toBeUndefined();
  expect(unitModifier.getDescription()).toBeUndefined();
  expect(unitModifier.getLinkToNsidName()).toBeUndefined();
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getNsidName()).toBeUndefined();
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
    cardClass: "agent",
    nsidName: "my-nsid-name",
    linkToNsidName: "my-link-to-nsid-name",
    isActiveIdle: true,
    isCombat: true,
  });
  expect(unitModifier.getCardClass()).toBe("agent");
  expect(unitModifier.getDescription()).toBe("my-description");
  expect(unitModifier.getLinkToNsidName()).toBe("my-link-to-nsid-name");
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getNsidName()).toEqual("my-nsid-name");
  expect(unitModifier.getOwner()).toBe("self");
  expect(unitModifier.getPriority()).toBe("mutate");
  expect(unitModifier.isActiveIdle()).toBe(true);
  expect(unitModifier.isCombat()).toBe(true);
});
