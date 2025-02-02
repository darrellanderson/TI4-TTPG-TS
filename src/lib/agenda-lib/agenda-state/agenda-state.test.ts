import { NamespaceId } from "ttpg-darrell";
import { MockPlayer } from "ttpg-mock";
import { AgendaState } from "./agenda-state";
import { world } from "@tabletop-playground/api";

it("constructor/destroy/isActive/static isAgendaInProgress", () => {
  const id: NamespaceId = "@test/test";
  expect(AgendaState.isAgendaInProgress(id)).toBe(false);

  const agendaState: AgendaState = new AgendaState(id);
  expect(AgendaState.isAgendaInProgress(id)).toBe(true);
  expect(agendaState.isActive()).toBe(true);

  // Construct again using exisitng state.
  new AgendaState(id);
  expect(AgendaState.isAgendaInProgress(id)).toBe(true);
  expect(agendaState.isActive()).toBe(true);

  agendaState.destroy();
  expect(AgendaState.isAgendaInProgress(id)).toBe(false);
  expect(agendaState.isActive()).toBe(false);
});

it("constructor (bad json)", () => {
  const id: NamespaceId = "@test/test";
  world.setSavedData("bad json", id);
  expect(() => new AgendaState(id)).toThrow();
});

it("transactThenTriggerDelayedStateChangedEvent", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getPhase()).toBe("whens");
  agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
    agendaState.setPhase("afters");
  });
  expect(agendaState.getPhase()).toBe("afters");
});

it("agenda obj id", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getAgendaObjId()).toBe("");
  agendaState.setAgendaObjId("my-obj-id");
  expect(agendaState.getAgendaObjId()).toBe("my-obj-id");
});

it("outcome name/num outcomes", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getNumOutcomes()).toBe(0);
  expect(agendaState.getOutcomeName(0)).toBeUndefined();
  expect(agendaState.getOutcomeName(1)).toBeUndefined();
  agendaState.setOutcomeName(
    1,
    "my-outcome this name is too long and will be truncated"
  );
  expect(agendaState.getNumOutcomes()).toBe(2);
  expect(agendaState.getOutcomeName(0)).toBeUndefined();
  expect(agendaState.getOutcomeName(1)).toBe("my-outcome this n...");
});

it("phase", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getPhase()).toBe("whens");
  agendaState.setPhase("afters");
  expect(agendaState.getPhase()).toBe("afters");
});

it("seat available votes", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getSeatAvailableVotes(0)).toBe(0);
  expect(agendaState.getSeatAvailableVotes(1)).toBe(0);
  agendaState.setSeatAvailableVotes(1, 2);
  expect(agendaState.getSeatAvailableVotes(0)).toBe(0);
  expect(agendaState.getSeatAvailableVotes(1)).toBe(2);
});

it("seat no afters", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");
  expect(agendaState.getSeatNoAfters(1)).toBe("unknown");
  agendaState.setSeatNoAfters(1, "no");
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");
  expect(agendaState.getSeatNoAfters(1)).toBe("no");
  agendaState.setSeatNoAfters(1, "never");
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");
  expect(agendaState.getSeatNoAfters(1)).toBe("never");
  agendaState.setSeatNoAfters(1, "play");
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");
  expect(agendaState.getSeatNoAfters(1)).toBe("play");
  agendaState.setSeatNoAfters(1, "unknown");
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");
  expect(agendaState.getSeatNoAfters(1)).toBe("unknown");
});

it("seat no whens", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");
  expect(agendaState.getSeatNoWhens(1)).toBe("unknown");
  agendaState.setSeatNoWhens(1, "no");
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");
  expect(agendaState.getSeatNoWhens(1)).toBe("no");
  agendaState.setSeatNoWhens(1, "never");
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");
  expect(agendaState.getSeatNoWhens(1)).toBe("never");
  agendaState.setSeatNoWhens(1, "play");
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");
  expect(agendaState.getSeatNoWhens(1)).toBe("play");
  agendaState.setSeatNoWhens(1, "unknown");
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");
  expect(agendaState.getSeatNoWhens(1)).toBe("unknown");
});

it("seat outcome choice", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getSeatOutcomeChoice(0)).toBe(-1);
  expect(agendaState.getSeatOutcomeChoice(1)).toBe(-1);
  agendaState.setSeatOutcomeChoice(1, 2);
  expect(agendaState.getSeatOutcomeChoice(0)).toBe(-1);
  expect(agendaState.getSeatOutcomeChoice(1)).toBe(2);
});

it("seat votes for outcome", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getSeatVotesForOutcome(0)).toBe(0);
  expect(agendaState.getSeatVotesForOutcome(1)).toBe(0);
  agendaState.setSeatVotesForOutcome(1, 2);
  expect(agendaState.getSeatVotesForOutcome(0)).toBe(0);
  expect(agendaState.getSeatVotesForOutcome(1)).toBe(2);
});

it("seat votes locked", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getSeatVotesLocked(0)).toBe(false);
  expect(agendaState.getSeatVotesLocked(1)).toBe(false);
  agendaState.setSeatVotesLocked(1, true);
  expect(agendaState.getSeatVotesLocked(0)).toBe(false);
  expect(agendaState.getSeatVotesLocked(1)).toBe(true);
});

it("rider", () => {
  const seatIndex: number = 1;
  const outcomeIndex: number = 13;

  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getRiders()).toEqual([]);

  agendaState.addRider(seatIndex, "my-rider-obj-id", outcomeIndex);
  expect(agendaState.getRiders()).toEqual([
    { seat: seatIndex, objId: "my-rider-obj-id", outcome: 13 },
  ]);

  agendaState.removeRider("my-rider-obj-id");
  expect(agendaState.getRiders()).toEqual([]);
});

it("waiting for", () => {
  new MockPlayer({ slot: 10, name: "my-name" });
  TI4.turnOrder.setTurnOrder([10], "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(agendaState.getWaitingForMessage()).toEqual("Any whens, green?");

  agendaState.setPhase("afters");
  expect(agendaState.getWaitingForMessage()).toEqual("Any afters, green?");

  agendaState.setPhase("voting");
  expect(agendaState.getWaitingForMessage()).toEqual("Please vote, green");
});
