import { PlayerSlot } from "ttpg-darrell";
import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { AdvanceNoWhensAfters } from "./advance-no-whens-afters";
import { AgendaState } from "./agenda-state";

beforeEach(() => {
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
  MockGameObject.simple("token:base/speaker", { position: [0, 1, 0] });
});

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
  expect(TI4.turnOrder.getTurnOrder()).toEqual([10, 11]);
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(false);

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 11);
  expect(TI4.turnOrder.getTurnOrder()).toEqual([10, 11]);
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
});

it("_isWhenPlayed", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(false);

  agendaState.setSeatNoWhens(0, "play");
  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(true);
});

it("_isAfterPlayed", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(false);

  agendaState.setSeatNoAfters(0, "play");
  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(true);
});

it("_isSkipTurnWhen", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

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

it("_resetWhensSuppressAgendaStateChangeEvent", () => {
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

it("_resetAftersSuppressAgendaStateChangeEvent", () => {
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
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "play");
  agendaState.setSeatNoWhens(1, "no");

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
  expect(advanceNoWhensAfters._isWhenPlayed()).toBe(true);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseWhens();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseWhens (advance)", () => {
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
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("afters");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setSeatNoAfters(0, "play");
  agendaState.setSeatNoAfters(1, "no");

  expect(advanceNoWhensAfters._isLastPlayerInTurnOrder()).toBe(true);
  expect(advanceNoWhensAfters._isAfterPlayed()).toBe(true);

  const success: boolean = advanceNoWhensAfters._maybeAdvancePhaseAfters();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("_maybeAdvancePhaseAfters (advance)", () => {
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

it("_maybeSkipTurnWhens (wrong phase)", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("voting");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeSkipTurnWhens();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("voting");
});

it("_maybeSkipTurnWhens (no skip)", () => {
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("whens");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeSkipTurnWhens();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("whens");
});

it("_maybeSkipTurnWhens (skip)", () => {
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "no");

  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeSkipTurnWhens();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
});

it("_maybeSkipTurnAfters (wrong phase)", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("voting");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeSkipTurnAfters();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("voting");
});

it("_maybeSkipTurnAfters (no skip)", () => {
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("afters");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeSkipTurnAfters();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("afters");
});

it("_maybeSkipTurnAfters (skip)", () => {
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("afters");
  agendaState.setSeatNoAfters(0, "no");

  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters._maybeSkipTurnAfters();
  expect(success).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
});

it("maybeAdvance", () => {
  const seats: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat) => seat.playerSlot);
  expect(seats).toEqual([10, 11]);

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 10);
  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setPhase("voting");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const success: boolean = advanceNoWhensAfters.maybeAdvance();
  expect(success).toBe(false);
  expect(agendaState.getPhase()).toBe("voting");
});
