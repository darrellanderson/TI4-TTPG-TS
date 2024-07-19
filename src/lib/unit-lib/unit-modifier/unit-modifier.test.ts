import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import {
  UnitModifierPriorityType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";
import { UnitModifier } from "./unit-modifier";

it("static schemaToNsid", () => {
  let trigger: UnitModifierTriggerType;

  trigger = { cardClass: "action", nsidName: "my-nsid-name" };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.action:my-source/my-nsid-name"
  );

  trigger = { cardClass: "agenda", nsidName: "my-nsid-name" };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.agenda:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "agent",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.agent:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "alliance",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.alliance:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "commander",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.commander:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "flagship",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "flagship:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "hero",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.hero:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "faction-ability",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "faction-ability:my-source/my-nsid-name"
  );

  trigger = { cardClass: "legendary", nsidName: "my-nsid-name" };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.legendary-planet:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "mech",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.leader.mech:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "promissory",
    nsidName: "my-nsid-name",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.promissory:my-source/my-nsid-name"
  );

  trigger = { cardClass: "relic", nsidName: "my-nsid-name" };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.relic:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "technology",
    nsidName: "my-nsid-name",
    techClass: "blue",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.technology.blue:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "technology",
    nsidName: "my-nsid-name",
    techClass: "green",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.technology.green:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "technology",
    nsidName: "my-nsid-name",
    techClass: "red",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.technology.red:my-source/my-nsid-name"
  );

  trigger = {
    cardClass: "technology",
    nsidName: "my-nsid-name",
    techClass: "unit-upgrade",
  };
  expect(UnitModifier.schemaTriggerToNsid("my-source", trigger)).toBe(
    "card.technology.unit-upgrade:my-source/my-nsid-name"
  );
});

it("static sortByApplyOrder", () => {
  const makeModifier = (priority: UnitModifierPriorityType): UnitModifier => {
    return new UnitModifier({
      name: "my-name",
      description: "my-description",
      owner: "self",
      priority,
      triggers: [
        {
          cardClass: "agent",
          nsidName: "my-nsid-name",
        },
      ],
      applies: (combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (combatRoll: CombatRoll): void => {},
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
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [],
    applies: (combatRoll: CombatRoll): boolean => {
      return true;
    },
    apply: (combatRoll: CombatRoll): void => {},
  });
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getDescription()).toBe("my-description");
  expect(unitModifier.getOwner()).toBe("self");
  expect(unitModifier.getPriority()).toBe("mutate");
  expect(unitModifier.isActiveIdle()).toBe(false);
});

it("constructor (with optional fields)", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "agent",
        nsidName: "my-nsid-name",
      },
    ],
    isActiveIdle: true,
    applies: (combatRoll: CombatRoll): boolean => {
      return true;
    },
    apply: (combatRoll: CombatRoll): void => {},
  });
  expect(unitModifier.getDescription()).toBe("my-description");
  expect(unitModifier.getName()).toBe("my-name");
  expect(unitModifier.getOwner()).toBe("self");
  expect(unitModifier.getPriority()).toBe("mutate");
  expect(unitModifier.isActiveIdle()).toBe(true);
});

it("applies/apply (empty)", () => {
  const unitModifier: UnitModifier = new UnitModifier({
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [],
    applies: (combatRoll: CombatRoll): boolean => {
      return true;
    },
    apply: (combatRoll: CombatRoll): void => {},
  });
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
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
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [],
    applies: (combatRoll: CombatRoll): boolean => {
      return true;
    },
    apply: (combatRoll: CombatRoll): void => {},
  });
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  });
  expect(unitModifier.applies(combatRoll)).toBe(true);
  unitModifier.apply(combatRoll);
});
