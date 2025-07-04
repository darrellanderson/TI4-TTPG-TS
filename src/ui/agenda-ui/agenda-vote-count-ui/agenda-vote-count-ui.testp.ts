import { Border, ScreenUIElement, world } from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaVoteCountUI } from "./agenda-vote-count-ui";

function go() {
  world.setSavedData("", "@test/test");
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const abstractUi: AbstractUI = new AgendaVoteCountUI(
    agendaState,
    seatIndex,
    scale
  );
  agendaState.onAgendaStateChanged.trigger(agendaState);

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
}

setTimeout(go, 100);
