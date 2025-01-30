import { MockCardHolder, MockGameObject, Player } from "ttpg-mock";
import { AdvanceNoWhensAfters } from "./advance-no-whens-afters";
import { AgendaState } from "./agenda-state";
import { PlayerSlot } from "ttpg-darrell";

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

it("_resetWhens", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setSeatNoWhens(0, "no");
  advanceNoWhensAfters._resetWhens();
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");

  agendaState.setSeatNoWhens(0, "never");
  advanceNoWhensAfters._resetWhens();
  expect(agendaState.getSeatNoWhens(0)).toBe("never");
});

it("_resetAfters", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setSeatNoAfters(0, "no");
  advanceNoWhensAfters._resetAfters();
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");

  agendaState.setSeatNoAfters(0, "never");
  advanceNoWhensAfters._resetAfters();
  expect(agendaState.getSeatNoAfters(0)).toBe("never");
});

it("_maybeAdvancePhaseWhens (wrong phase)", () => {
  TI4.config.setPlayerCount(2);
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("voting");
  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseWhens();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("voting");
});

it("_maybeAdvancePhaseWhens (not last in turn order)", () => {
  TI4.config.setPlayerCount(2);
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(false);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseWhens();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseWhens (last in turn order, when played)", () => {
  TI4.config.setPlayerCount(2);
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(true);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseWhens();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseWhens (advance)", () => {
  TI4.config.setPlayerCount(2);
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
  MockGameObject.simple("token:base/speaker");

  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "no");
  agendaState.setSeatNoWhens(1, "no");

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(false);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseWhens();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseAfters (wrong phase)", () => {
  TI4.config.setPlayerCount(2);
  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("whens");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseAfters();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("whens");
});

it("_maybeAdvancePhaseAfters (not last in turn order)", () => {
  TI4.config.setPlayerCount(2);
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("afters");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(false);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseAfters();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseAfters (last in turn order, after played)", () => {
  TI4.config.setPlayerCount(2);
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("afters");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(true);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseAfters();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseAfters (advance)", () => {
  TI4.config.setPlayerCount(2);
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
  MockGameObject.simple("token:base/speaker");

  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("afters");
  agendaState.setSeatNoAfters(0, "no");
  agendaState.setSeatNoAfters(1, "no");

  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(false);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseAfters();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("voting");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
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
