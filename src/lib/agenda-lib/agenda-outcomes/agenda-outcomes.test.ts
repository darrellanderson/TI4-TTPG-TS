import { MockCardHolder } from "ttpg-mock";
import { AgendaState } from "../agenda-state/agenda-state";
import { AgendaOutcomes } from "./agenda-outcomes";

it("constructor", () => {
  new AgendaOutcomes();
});

it('populate ("for-against")', () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const success: boolean = new AgendaOutcomes().populate(
    agendaState,
    "for-against"
  );
  expect(success).toBe(true);
  expect(agendaState.getNumOutcomes()).toBe(2);
  expect(agendaState.getOutcomeName(0)).toBe("For");
  expect(agendaState.getOutcomeName(1)).toBe("Against");
});

it('populate ("player")', () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const agendaState: AgendaState = new AgendaState("@test/test");
  const success: boolean = new AgendaOutcomes().populate(agendaState, "player");
  expect(success).toBe(true);
  expect(agendaState.getNumOutcomes()).toBe(1);
  expect(agendaState.getOutcomeName(0)).toBe("green");
});

it('populate ("strategy-card")', () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const success: boolean = new AgendaOutcomes().populate(
    agendaState,
    "strategy-card"
  );
  expect(success).toBe(true);
  expect(agendaState.getNumOutcomes()).toBe(8);
  expect(agendaState.getOutcomeName(0)).toBe("Leadership");
  expect(agendaState.getOutcomeName(1)).toBe("Diplomacy");
  expect(agendaState.getOutcomeName(2)).toBe("Politics");
  expect(agendaState.getOutcomeName(3)).toBe("Construction");
  expect(agendaState.getOutcomeName(4)).toBe("Trade");
  expect(agendaState.getOutcomeName(5)).toBe("Warfare");
  expect(agendaState.getOutcomeName(6)).toBe("Technology");
  expect(agendaState.getOutcomeName(7)).toBe("Imperial");
});

it('populate ("other")', () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const success: boolean = new AgendaOutcomes().populate(agendaState, "other");
  expect(success).toBe(true);
  expect(agendaState.getNumOutcomes()).toBe(8);
  expect(agendaState.getOutcomeName(0)).toBe("");
  expect(agendaState.getOutcomeName(1)).toBe("");
  expect(agendaState.getOutcomeName(2)).toBe("");
  expect(agendaState.getOutcomeName(3)).toBe("");
  expect(agendaState.getOutcomeName(4)).toBe("");
  expect(agendaState.getOutcomeName(5)).toBe("");
  expect(agendaState.getOutcomeName(6)).toBe("");
  expect(agendaState.getOutcomeName(7)).toBe("");
});

it("populate (fail)", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const success: boolean = new AgendaOutcomes().populate(
    agendaState,
    "__invalid__"
  );
  expect(success).toBe(false);
  expect(agendaState.getNumOutcomes()).toBe(0);
  expect(agendaState.getOutcomeName(0)).toBe(undefined);
});

it("populateOrThrow", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(() => {
    new AgendaOutcomes().populateOrThrow(agendaState, "__invalid__");
  }).toThrow();
});
