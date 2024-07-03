import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import {
  UnitModifierCardClassType,
  UnitModifierPriorityType,
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

  trigger = makeTrigger("faction-ability");
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "faction-ability:my-source/my-nsid-name"
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
  const makeModifier = (priority: UnitModifierPriorityType): UnitModifier => {
    return new UnitModifier({
      name: "my-name",
      triggers: [
        {
          cardClass: "agent",
          nsidName: "my-nsid-name",
        },
      ],
      owner: "self",
      priority,
    });
  };
  const modifiers: Array<UnitModifier> = [
    makeModifier("adjust"),
    makeModifier("choose"),
    makeModifier("mutate-late"),
    makeModifier("mutate"),
    makeModifier("adjust"),
    makeModifier("choose"),
    makeModifier("mutate-late"),
    makeModifier("mutate"),
  ];
  const sorted: Array<UnitModifier> = UnitModifier.sortByApplyOrder(modifiers);
  const priorities: Array<UnitModifierPriorityType> = sorted.map(
    (unitModifier) => unitModifier.getPriority()
  );
  expect(priorities).toEqual([
    "mutate",
    "mutate",
    "mutate-late",
    "mutate-late",
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

it("applies/apply (empty)", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    owner: "self",
    priority: "mutate",
  });
  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  });
  expect(unitModifier.applies(combatRoll)).toBe(true);
  unitModifier.apply(combatRoll);
});

it("applies/apply (given)", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    owner: "self",
    priority: "mutate",
    applies: (combatRoll: CombatRoll): boolean => {
      return true;
    },
    apply: (combatRoll: CombatRoll): void => {},
  });
  const combatRoll: CombatRoll = new CombatRoll({
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  });
  expect(unitModifier.applies(combatRoll)).toBe(true);
  unitModifier.apply(combatRoll);
});
