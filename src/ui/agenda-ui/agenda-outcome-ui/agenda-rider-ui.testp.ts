import {
  Border,
  GameObject,
  ScreenUIElement,
  world,
} from "@tabletop-playground/api";

import { AbstractUI } from "ui/abstract-ui/abtract-ui";
import { AgendaRiderUI } from "./agenda-rider-ui";
import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";

function go() {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const outcomeIndex: number = 0;
  const scale: number = 1;
  const abstractUi: AbstractUI = new AgendaRiderUI(
    agendaState,
    outcomeIndex,
    scale
  );

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUi.getSize().w + 4; // border
  screenUI.height = abstractUi.getSize().h + 4;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(abstractUi.getWidget());

  world.addScreenUI(screenUI);

  // Instead of finding a rider, use the agenda card to test.
  const riderCard: GameObject | undefined = world.getObjectById("rider");
  if (!riderCard) {
    throw new Error(`Object with ID "rider" not found`);
  }
  const seatIndex: number = 1;
  agendaState.addRider(seatIndex, riderCard.getId(), outcomeIndex);
}

setTimeout(go, 100);
