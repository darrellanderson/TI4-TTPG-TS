import {
  UnitModifierCardClassType,
  UnitModifierSchemaType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";
import { UnitModifier } from "./unit-modifier";

it("static schemaToNsid", () => {
  const makeTrigger = (
    cardClass: UnitModifierCardClassType
  ): UnitModifierTriggerType => {
    return {
      cardClass,
      nsidName: "my-nsid-name",
    };
  };
  let trigger: UnitModifierTriggerType;

  trigger = makeTrigger("action");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.action:my-source/my-nsid-name"
  );

  trigger = makeTrigger("agenda");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.agenda:my-source/my-nsid-name"
  );

  trigger = makeTrigger("agent");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.agent:my-source/my-nsid-name"
  );

  trigger = makeTrigger("alliance");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.alliance:my-source/my-nsid-name"
  );

  trigger = makeTrigger("commander");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.commander:my-source/my-nsid-name"
  );

  trigger = makeTrigger("hero");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.hero:my-source/my-nsid-name"
  );

  trigger = makeTrigger("legendary");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.legendary-planet:my-source/my-nsid-name"
  );

  trigger = makeTrigger("promissory");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.promissory:my-source/my-nsid-name"
  );

  trigger = makeTrigger("relic");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.relic:my-source/my-nsid-name"
  );

  trigger = makeTrigger("technology");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.technology:my-source/my-nsid-name"
  );

  trigger = {
    nsidName: "my-nsid-name",
  };
  expect(
    UnitModifier.schemaTriggerToNsid("my-source", trigger)
  ).toBeUndefined();
});

it("static sortByApplyOrder", () => {
  const makeSchema = (
    priority: "mutate" | "adjust" | "choose"
  ): UnitModifierSchemaType => {
    return {
      name: "my-name",
      triggers: [
        {
          cardClass: "agent",
          nsidName: "my-nsid-name",
        },
      ],
      owner: "self",
      priority,
    };
  };
  const schemas: Array<UnitModifierSchemaType> = [
    makeSchema("adjust"),
    makeSchema("choose"),
    makeSchema("mutate"),
    makeSchema("adjust"),
    makeSchema("choose"),
    makeSchema("mutate"),
  ];
  const sortedSchemas: Array<UnitModifierSchemaType> =
    UnitModifier.sortByApplyOrder(schemas);
  const priorities: Array<"mutate" | "adjust" | "choose"> = sortedSchemas.map(
    (schema) => schema.priority
  );
  expect(priorities).toEqual([
    "mutate",
    "mutate",
    "adjust",
    "adjust",
    "choose",
    "choose",
  ]);
});

it("constructor", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    owner: "self",
    priority: "mutate",
  });
  expect(unitModifier.getDescription()).toBeUndefined();
  expect(unitModifier.getName()).toBe("my-name");
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
    triggers: [
      {
        cardClass: "agent",
        nsidName: "my-nsid-name",
      },
    ],
    isActiveIdle: true,
    isCombat: true,
  });
  expect(unitModifier.getDescription()).toBe("my-description");
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getOwner()).toBe("self");
  expect(unitModifier.getPriority()).toBe("mutate");
  expect(unitModifier.isActiveIdle()).toBe(true);
  expect(unitModifier.isCombat()).toBe(true);
});
