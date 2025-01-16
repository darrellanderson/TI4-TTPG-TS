import { MockCardHolder, MockPlayer } from "ttpg-mock";
import { AgendaState } from "./agenda-state";
import { ReportFinalAgendaState } from "./report-final-agenda-state";

it("constructor", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  new ReportFinalAgendaState(agendaState);
});

it("static isComplete", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [1, 0, 0],
  });
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(10)).toBe(0);
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(11)).toBe(1);

  const agendaState: AgendaState = new AgendaState("@test/test");
  expect(ReportFinalAgendaState.isComplete(agendaState)).toBe(false);

  agendaState.setPhase("voting");

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 11);
  expect(ReportFinalAgendaState.isComplete(agendaState)).toBe(false);

  agendaState.setSeatsVotesLocked(1, true);
  expect(ReportFinalAgendaState.isComplete(agendaState)).toBe(true);
});

it("static getOutcomeIndexToTotalVotes", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");

  const outcomeIndex: number = 0;
  const seatIndex: number = 0;
  const votes: number = 13;
  agendaState.setSeatOutcomeChoice(seatIndex, outcomeIndex);
  agendaState.setSeatVotesForOutcome(seatIndex, votes);
  agendaState.setSeatOutcomeChoice(1, 1);
  agendaState.setSeatVotesForOutcome(1, 2);
  agendaState.setSeatOutcomeChoice(2, 2);
  agendaState.setSeatVotesForOutcome(2, 3);

  const outcomeIndexToTotalVotes: Map<number, number> =
    ReportFinalAgendaState.getOutcomeIndexToTotalVotes(agendaState);
  expect(outcomeIndexToTotalVotes.get(0)).toBe(13);
  expect(outcomeIndexToTotalVotes.get(1)).toBe(2);
  expect(outcomeIndexToTotalVotes.get(2)).toBe(3);
});

it("static getOutcomeSummaries", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");

  const outcomeIndex: number = 0;
  const seatIndex: number = 0;
  const votes: number = 13;
  agendaState.setOutcomeName(outcomeIndex, "Outcome 1");
  agendaState.setOutcomeName(1, "Outcome 2");
  agendaState.setOutcomeName(2, "Outcome 3");
  agendaState.setSeatOutcomeChoice(seatIndex, outcomeIndex);
  agendaState.setSeatVotesForOutcome(seatIndex, votes);
  agendaState.setSeatOutcomeChoice(1, 1);
  agendaState.setSeatVotesForOutcome(1, 2);
  agendaState.setSeatOutcomeChoice(2, 2);
  agendaState.setSeatVotesForOutcome(2, 3);

  const outcomeSummaries =
    ReportFinalAgendaState.getOutcomeSummaries(agendaState);
  expect(outcomeSummaries).toEqual([
    {
      outcomeIndex: 0,
      outcomeName: "Outcome 1",
      totalVotes: 13,
      votingPlayerSlots: [-1],
    },
    {
      outcomeIndex: 2,
      outcomeName: "Outcome 3",
      totalVotes: 3,
      votingPlayerSlots: [-1],
    },
    {
      outcomeIndex: 1,
      outcomeName: "Outcome 2",
      totalVotes: 2,
      votingPlayerSlots: [-1],
    },
  ]);
});

it("static summary", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [1, 0, 0],
  });
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(10)).toBe(0);
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(11)).toBe(1);
  new MockPlayer({ slot: 10, name: "player-1" });
  new MockPlayer({ slot: 11, name: "player-2" });

  const agendaState: AgendaState = new AgendaState("@test/test");

  const outcomeIndex: number = 0;
  const seatIndex: number = 0;
  const votes: number = 13;
  agendaState.setOutcomeName(outcomeIndex, "Outcome 1");
  agendaState.setOutcomeName(1, "Outcome 2");
  agendaState.setOutcomeName(2, "Outcome 3");
  agendaState.setOutcomeName(3, "Outcome 4");
  agendaState.setSeatOutcomeChoice(seatIndex, outcomeIndex);
  agendaState.setSeatVotesForOutcome(seatIndex, votes);
  agendaState.setSeatOutcomeChoice(1, 1);
  agendaState.setSeatVotesForOutcome(1, 2);
  agendaState.setSeatOutcomeChoice(2, 2);
  agendaState.setSeatVotesForOutcome(2, 3);

  const summary: string = ReportFinalAgendaState.summary(agendaState);
  expect(summary).toBe(
    '"Outcome 1" 13 votes by green, "Outcome 3" 3 votes by ???, "Outcome 2" 2 votes by red'
  );
});

it("constructor/event", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  new ReportFinalAgendaState(agendaState);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [1, 0, 0],
  });
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(10)).toBe(0);
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(11)).toBe(1);

  expect(ReportFinalAgendaState.isComplete(agendaState)).toBe(false);

  agendaState.setPhase("voting");

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 11);
  expect(ReportFinalAgendaState.isComplete(agendaState)).toBe(false);

  agendaState.setSeatsVotesLocked(1, true);
  expect(ReportFinalAgendaState.isComplete(agendaState)).toBe(true);
});
