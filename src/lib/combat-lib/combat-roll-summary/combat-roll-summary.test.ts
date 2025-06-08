import { DiceResult } from "ttpg-darrell";

import { CombatRoll } from "../combat-roll/combat-roll";
import { CombatRollSummary, UnitRollsSummary } from "./combat-roll-summary";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";

it("_getUnitRollSummaries (no crit)", () => {
  const diceResults: Array<DiceResult> = [
    {
      diceParams: {
        id: "carrier",
        sides: 10,
      },
      hit: true,
      value: 9,
    },
  ];
  const summaries: Map<UnitType, UnitRollsSummary> =
    CombatRollSummary.getUnitRollsSummaries(diceResults);
  expect(summaries.get("carrier")).toEqual({
    diceParams: {
      id: "carrier",
      sides: 10,
    },
    diceWithHitsCritsAndRerolls: ["9#"],
    hits: 1,
  });
});

it("_getUnitRollSummaries (crit)", () => {
  const diceResults: Array<DiceResult> = [
    {
      diceParams: {
        id: "carrier",
        sides: 10,
      },
      hit: true,
      crit: true,
      value: 9,
    },
  ];
  const summaries: Map<UnitType, UnitRollsSummary> =
    CombatRollSummary.getUnitRollsSummaries(diceResults);
  expect(summaries.get("carrier")).toEqual({
    diceParams: {
      id: "carrier",
      sides: 10,
    },
    diceWithHitsCritsAndRerolls: ["9##"],
    hits: 2,
  });
});

it("_getUnitRollSummaries (crit with count)", () => {
  const diceResults: Array<DiceResult> = [
    {
      diceParams: {
        id: "carrier",
        sides: 10,
        critCount: 2,
      },
      hit: true,
      crit: true,
      value: 9,
    },
  ];
  const summaries: Map<UnitType, UnitRollsSummary> =
    CombatRollSummary.getUnitRollsSummaries(diceResults);
  expect(summaries.get("carrier")).toEqual({
    diceParams: {
      id: "carrier",
      sides: 10,
      critCount: 2,
    },
    diceWithHitsCritsAndRerolls: ["9###"],
    hits: 3,
  });
});

it("getSimpleSummary", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 10,
  });
  const diceResults: Array<DiceResult> = [
    {
      diceParams: {
        id: "carrier",
        hit: 9,
        crit: 10,
        sides: 10,
      },
      hit: true,
      crit: true,
      value: 9,
    },
  ];

  const unitRollsSummaries: Map<UnitType, UnitRollsSummary> =
    CombatRollSummary.getUnitRollsSummaries(diceResults);
  expect(unitRollsSummaries.get("carrier")).toBeDefined();

  expect(
    CombatRollSummary.getSimpleSummary(combatRoll, unitRollsSummaries)
  ).toEqual(
    "green rolled 2 hits: Carrier (9|10): 9##\nModifiers: no modifiers"
  );
});

it("broadcast", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 10,
    rollingPlayerSlot: 10,
  });
  const diceResults: Array<DiceResult> = [];
  const summary: CombatRollSummary = new CombatRollSummary(
    combatRoll,
    diceResults
  );
  summary.broadcastAll();
});

it("broadcast (anonymous roller)", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 10,
    rollingPlayerSlot: 19,
  });
  const diceResults: Array<DiceResult> = [];
  const summary: CombatRollSummary = new CombatRollSummary(
    combatRoll,
    diceResults
  );
  summary.broadcastAll();
});
