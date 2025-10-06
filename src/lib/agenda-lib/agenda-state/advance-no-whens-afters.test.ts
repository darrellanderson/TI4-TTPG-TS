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
  new AdvanceNoWhensAfters(agendaState).activate(true);
});

it("_getSeatPlayerSlots", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  const playerSlots: Array<PlayerSlot> =
    advanceNoWhensAfters._getSeatPlayerSlots();
  expect(playerSlots).toEqual([10, 11]);
});

it("getUncommittedWhens", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setSeatNoWhens(0, "unknown");
  agendaState.setSeatNoWhens(1, "no");
  expect(advanceNoWhensAfters.getUncommittedWhens()).toEqual([10]);

  agendaState.setSeatNoWhens(0, "no");
  agendaState.setSeatNoWhens(1, "unknown");
  expect(advanceNoWhensAfters.getUncommittedWhens()).toEqual([11]);

  agendaState.setSeatNoWhens(0, "unknown");
  agendaState.setSeatNoWhens(1, "unknown");
  expect(advanceNoWhensAfters.getUncommittedWhens()).toEqual([10, 11]);

  agendaState.setSeatNoWhens(0, "no");
  agendaState.setSeatNoWhens(1, "no");
  expect(advanceNoWhensAfters.getUncommittedWhens()).toEqual([]);
});

it("getUncommittedAfters", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setSeatNoAfters(0, "unknown");
  agendaState.setSeatNoAfters(1, "no");
  expect(advanceNoWhensAfters.getUncommittedAfters()).toEqual([10]);

  agendaState.setSeatNoAfters(0, "no");
  agendaState.setSeatNoAfters(1, "unknown");
  expect(advanceNoWhensAfters.getUncommittedAfters()).toEqual([11]);

  agendaState.setSeatNoAfters(0, "unknown");
  agendaState.setSeatNoAfters(1, "unknown");
  expect(advanceNoWhensAfters.getUncommittedAfters()).toEqual([10, 11]);

  agendaState.setSeatNoAfters(0, "no");
  agendaState.setSeatNoAfters(1, "no");
  expect(advanceNoWhensAfters.getUncommittedAfters()).toEqual([]);
});

it("getUncommittedVotes", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );

  agendaState.setSeatVotesLocked(0, false);
  agendaState.setSeatVotesLocked(1, true);
  expect(advanceNoWhensAfters.getUncommittedVotes()).toEqual([10]);

  agendaState.setSeatVotesLocked(0, true);
  agendaState.setSeatVotesLocked(1, false);
  expect(advanceNoWhensAfters.getUncommittedVotes()).toEqual([11]);

  agendaState.setSeatVotesLocked(0, false);
  agendaState.setSeatVotesLocked(1, false);
  expect(advanceNoWhensAfters.getUncommittedVotes()).toEqual([10, 11]);

  agendaState.setSeatVotesLocked(0, true);
  agendaState.setSeatVotesLocked(1, true);
  expect(advanceNoWhensAfters.getUncommittedVotes()).toEqual([]);
});

it("getRemainingTurnOrder", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  expect(advanceNoWhensAfters.getRemainingTurnOrder()).toEqual([10, 11]);

  TI4.turnOrder.setTurnOrder(order, "forward", 11);
  expect(advanceNoWhensAfters.getRemainingTurnOrder()).toEqual([11]);

  TI4.turnOrder.setTurnOrder(order, "forward", 99); // current turn not in order list
  expect(advanceNoWhensAfters.getRemainingTurnOrder()).toEqual([10, 11]);
});

it('handlePhaseWhens (not "whens" phase)', () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("voting");
  expect(advanceNoWhensAfters.handlePhaseWhens()).toBe(false);
});

it("handlePhaseWhens (uncommitted whens, waiting on current)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "unknown");
  agendaState.setSeatNoWhens(1, "no");
  expect(advanceNoWhensAfters.handlePhaseWhens()).toBe(true);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("handlePhaseWhens (uncommitted whens, find one later in turn order)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "no");
  agendaState.setSeatNoWhens(1, "unknown");
  expect(advanceNoWhensAfters.handlePhaseWhens()).toBe(true);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
});

it("handlePhaseWhens (uncommitted whens, wrap and find earlier in turn order)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "unknown");
  agendaState.setSeatNoWhens(1, "no");
  expect(advanceNoWhensAfters.handlePhaseWhens()).toBe(true);
  expect(agendaState.getPhase()).toBe("whens");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
  expect(agendaState.getSeatNoWhens(0)).toBe("unknown");
  expect(agendaState.getSeatNoWhens(1)).toBe("unknown"); // reset!
});

it("handlePhaseWhens (no uncommitted whens, advance to afters)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("whens");
  agendaState.setSeatNoWhens(0, "no");
  agendaState.setSeatNoWhens(1, "no");
  expect(advanceNoWhensAfters.handlePhaseWhens()).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it('handlePhaseAfters (not "afters" phase)', () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("voting");
  expect(advanceNoWhensAfters.handlePhaseAfters()).toBe(false);
});

it("handlePhaseAfters (uncommitted afters, waiting on current)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("afters");
  agendaState.setSeatNoAfters(0, "unknown");
  agendaState.setSeatNoAfters(1, "no");
  expect(advanceNoWhensAfters.handlePhaseAfters()).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("handlePhaseAfters (uncommitted afters, find one later in turn order)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("afters");
  agendaState.setSeatNoAfters(0, "no");
  agendaState.setSeatNoAfters(1, "unknown");
  expect(advanceNoWhensAfters.handlePhaseAfters()).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
});

it("handlePhaseAfters (uncommitted afters, wrap and find earlier in turn order)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("afters");
  agendaState.setSeatNoAfters(0, "unknown");
  agendaState.setSeatNoAfters(1, "no");
  expect(advanceNoWhensAfters.handlePhaseAfters()).toBe(true);
  expect(agendaState.getPhase()).toBe("afters");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
  expect(agendaState.getSeatNoAfters(0)).toBe("unknown");
  expect(agendaState.getSeatNoAfters(1)).toBe("unknown"); // reset!
});

it("handlePhaseAfters (no uncommitted afters, advance to voting)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("afters");
  agendaState.setSeatNoAfters(0, "no");
  agendaState.setSeatNoAfters(1, "no");
  expect(advanceNoWhensAfters.handlePhaseAfters()).toBe(true);
  expect(agendaState.getPhase()).toBe("voting");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11); // voting order
});

it('handlePhaseVoting (not "voting" phase)', () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("afters");
  expect(advanceNoWhensAfters.handlePhaseVoting()).toBe(false);
});

it("handlePhaseVoting (uncommitted votes, waiting on current)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("voting");
  agendaState.setSeatVotesLocked(0, false);
  agendaState.setSeatVotesLocked(1, true);
  expect(advanceNoWhensAfters.handlePhaseVoting()).toBe(true);
  expect(agendaState.getPhase()).toBe("voting");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});

it("handlePhaseVoting (uncommitted votes, find one later in turn order)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("voting");
  agendaState.setSeatVotesLocked(0, true);
  agendaState.setSeatVotesLocked(1, false);
  expect(advanceNoWhensAfters.handlePhaseVoting()).toBe(true);
  expect(agendaState.getPhase()).toBe("voting");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
});

it("handlePhaseVoting (uncommitted votes, wrap and find earlier in turn order)", () => {
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 11);

  const agendaState: AgendaState = new AgendaState("@test/test");
  const advanceNoWhensAfters: AdvanceNoWhensAfters = new AdvanceNoWhensAfters(
    agendaState
  );
  agendaState.setPhase("voting");
  agendaState.setSeatVotesLocked(0, false);
  agendaState.setSeatVotesLocked(1, true);
  expect(advanceNoWhensAfters.handlePhaseVoting()).toBe(true);
  expect(agendaState.getPhase()).toBe("voting");
  expect(TI4.turnOrder.getCurrentTurn()).toBe(10);
});
