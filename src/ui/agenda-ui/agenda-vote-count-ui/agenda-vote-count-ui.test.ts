import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaVoteCountUI } from "./agenda-vote-count-ui";

it("constructor/destroy", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  new AgendaVoteCountUI(agendaState, seatIndex, scale).destroy();
});

it("_decr", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const agendaVoteCountUI: AgendaVoteCountUI = new AgendaVoteCountUI(
    agendaState,
    seatIndex,
    scale
  );
  agendaState.setSeatVotesForOutcome(seatIndex, 1);
  expect(agendaState.getSeatVotesForOutcome(seatIndex)).toBe(1);

  agendaVoteCountUI._decr();
  expect(agendaState.getSeatVotesForOutcome(seatIndex)).toBe(0);

  agendaVoteCountUI._decr();
  expect(agendaState.getSeatVotesForOutcome(seatIndex)).toBe(0);

  agendaVoteCountUI.destroy();
});

it("_incr", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const agendaVoteCountUI: AgendaVoteCountUI = new AgendaVoteCountUI(
    agendaState,
    seatIndex,
    scale
  );
  expect(agendaState.getSeatVotesForOutcome(seatIndex)).toBe(0);

  agendaVoteCountUI._incr();
  expect(agendaState.getSeatVotesForOutcome(seatIndex)).toBe(1);

  agendaVoteCountUI.destroy();
});

it("_onLockClicked", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const agendaVoteCountUI: AgendaVoteCountUI = new AgendaVoteCountUI(
    agendaState,
    seatIndex,
    scale
  );
  agendaVoteCountUI._onLockClicked(); // lock
  agendaVoteCountUI._onLockClicked(); // unlock
  agendaVoteCountUI.destroy();
});

it("_applyVoteCountToAgendaState", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const agendaVoteCountUI: AgendaVoteCountUI = new AgendaVoteCountUI(
    agendaState,
    seatIndex,
    scale
  );
  agendaVoteCountUI._applyVoteCountToAgendaState();
  agendaVoteCountUI.destroy();
});

it("_onVotesChanged", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const agendaVoteCountUI: AgendaVoteCountUI = new AgendaVoteCountUI(
    agendaState,
    seatIndex,
    scale
  );
  agendaVoteCountUI._onVotesChanged();
  agendaVoteCountUI._onVotesChanged(); // clear timeout set by first
  agendaVoteCountUI.destroy();
});
