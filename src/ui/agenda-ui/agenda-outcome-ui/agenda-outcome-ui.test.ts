import { AgendaOutcomeUI } from "./agenda-outcome-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { Button, Player } from "@tabletop-playground/api";
import { MockButton, MockCardHolder, MockPlayer } from "ttpg-mock";

it("constructor, event", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const outcomeIndex: number = 0;
  const scale: number = 1;
  const agendaOutcomeUI = new AgendaOutcomeUI(agendaState, outcomeIndex, scale);
  agendaOutcomeUI._onEdited("Test");
});

it("agenda state changed", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const outcomeIndex: number = 0;
  const scale: number = 1;
  new AgendaOutcomeUI(agendaState, outcomeIndex, scale);

  agendaState.onAgendaStateChanged.trigger(agendaState);

  agendaState.setOutcomeName(outcomeIndex, "Test");
  agendaState.onAgendaStateChanged.trigger(agendaState);
});

it("outcome button clicked", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const player: Player = new MockPlayer({ slot: 10 });

  const agendaState: AgendaState = new AgendaState("@test/test");
  const outcomeIndex: number = 0;
  const scale: number = 1;
  const agendaOutcomeUI: AgendaOutcomeUI = new AgendaOutcomeUI(
    agendaState,
    outcomeIndex,
    scale
  );

  expect(agendaState.getSeatOutcomeChoice(0)).toBe(-1);

  const button: Button = new MockButton();
  agendaOutcomeUI._onOutcomeClicked(button, player);

  expect(agendaState.getSeatOutcomeChoice(0)).toBe(0);

  // Also set a positive vote count.
  agendaState.setSeatVotesForOutcome(0, 1);
});
