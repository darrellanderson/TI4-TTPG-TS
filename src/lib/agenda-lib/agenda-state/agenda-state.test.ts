import { NamespaceId } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";

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
  agendaState.setOutcomeName(1, "my-outcome");
  expect(agendaState.getNumOutcomes()).toBe(2);
  expect(agendaState.getOutcomeName(0)).toBeUndefined();
  expect(agendaState.getOutcomeName(1)).toBe("my-outcome");
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
