import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { AdvanceNoWhensAfters } from "./advance-no-whens-afters";
import { AgendaState } from "./agenda-state";

it("constructor", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  new AdvanceNoWhensAfters(agendaState);
});

it("_isLastPlayerInTurnOrder", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);
  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(false);

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 11);
  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
});

it("_isWhenPlayed", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(true);

  for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
    agendaState.setSeatNoWhens(seatIndex, "no");
  }
  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(false);
});

it("_isAfterPlayed", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(true);

  for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
    agendaState.setSeatNoAfters(seatIndex, "no");
  }
  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(false);
});

it("_isSkipTurnWhen", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, -1, 0],
  });
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);

  agendaState.setSeatNoWhens(0, "unknown");
  expect(advanceNoWhensAfters._isSkipTurnWhen()).toBe(false);

  agendaState.setSeatNoWhens(0, "no");
  expect(advanceNoWhensAfters._isSkipTurnWhen()).toBe(true);

  agendaState.setSeatNoWhens(0, "never");
  expect(advanceNoWhensAfters._isSkipTurnWhen()).toBe(true);
});

it("_isSkipTurnAfter", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, -1, 0],
  });
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);

  agendaState.setSeatNoAfters(0, "unknown");
  expect(advanceNoWhensAfters._isSkipTurnAfter()).toBe(false);

  agendaState.setSeatNoAfters(0, "no");
  expect(advanceNoWhensAfters._isSkipTurnAfter()).toBe(true);

  agendaState.setSeatNoAfters(0, "never");
  expect(advanceNoWhensAfters._isSkipTurnAfter()).toBe(true);
});

it("_isSkipTurn", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setPhase("whens");
  expect(advanceNoWhensAfters._isSkipTurn()).toBe(false);

  agendaState.setPhase("afters");
  expect(advanceNoWhensAfters._isSkipTurn()).toBe(false);

  agendaState.setPhase("voting");
  expect(advanceNoWhensAfters._isSkipTurn()).toBe(false);
});

/*
it("advance next turn, next phase", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, -1, 0],
  });
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  new MockGameObject({
    templateMetadata: "token:base/speaker",
    position: [-1, -1, 0],
  });

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  let stateChangeCount: number = 0;
  agendaState.onAgendaStateChanged.add(() => {
    stateChangeCount++;
  });

  new AdvanceNoWhensAfters(agendaState);

  expect(stateChangeCount).toBe(0);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);

  agendaState.setSeatNoWhens(0, "no");
  expect(agendaState.getSeatNoWhens(0)).toBe("no");
  expect(stateChangeCount).toBe(2);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);

  agendaState.setSeatNoWhens(1, "never");
  expect(agendaState.getSeatNoWhens(1)).toBe("never");
  expect(stateChangeCount).toBe(5);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);

  agendaState.setSeatNoAfters(0, "no");
  expect(agendaState.getSeatNoAfters(0)).toBe("no");
  expect(stateChangeCount).toBe(7);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);

  agendaState.setSeatNoAfters(1, "never");
  expect(agendaState.getSeatNoAfters(1)).toBe("never");
  expect(stateChangeCount).toBe(10);
  expect(agendaState.getPhase()).toBe("voting");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});
*/
