import {
  UnitModifierCardClassType,
  UnitModifierSchemaType,
} from "../schema/unit-modifier-schema";
import { UnitModifier } from "./unit-modifier";

it("schemaToNsid", () => {
  const makeSchema = (
    cardClass: UnitModifierCardClassType
  ): UnitModifierSchemaType => {
    return {
      name: "my-name",
      cardClass,
      nsidName: "my-nsid-name",
      owner: "self",
      priority: "mutate",
    };
  };
  let schema: UnitModifierSchemaType;

  schema = makeSchema("action");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.action:my-source/my-nsid-name"
  );

  schema = makeSchema("agenda");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.agenda:my-source/my-nsid-name"
  );

  schema = makeSchema("agent");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.leader.agent:my-source/my-nsid-name"
  );

  schema = makeSchema("alliance");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.alliance:my-source/my-nsid-name"
  );

  schema = makeSchema("commander");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.leader.commander:my-source/my-nsid-name"
  );

  schema = makeSchema("hero");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.leader.hero:my-source/my-nsid-name"
  );

  schema = makeSchema("legendary");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.legendary-planet:my-source/my-nsid-name"
  );

  schema = makeSchema("promissory");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.promissory:my-source/my-nsid-name"
  );

  schema = makeSchema("relic");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.relic:my-source/my-nsid-name"
  );

  schema = makeSchema("technology");
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBe(
    "card.technology:my-source/my-nsid-name"
  );

  schema = {
    name: "my-name",
    owner: "self",
    priority: "mutate",
  };
  expect(UnitModifier.schemaToNsid("my-source", schema)).toBeUndefined();
});

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
