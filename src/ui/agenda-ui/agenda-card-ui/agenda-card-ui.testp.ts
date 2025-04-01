import {
  Border,
  Card,
  GameObject,
  ScreenUIElement,
  world,
} from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaCardUI } from "./agenda-card-ui";

function go() {
  const agendaCardObjId: string = "agenda";
  const agendaCard: GameObject | undefined =
    world.getObjectById(agendaCardObjId);
  if (!agendaCard || !(agendaCard instanceof Card)) {
    throw new Error(`Object with ID "${agendaCardObjId}" is not a Card`);
  }

  const scale: number = 1;
  const abstractUi: AbstractUI = new AgendaCardUI(agendaCard, scale);

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

setTimeout(go, 1000);
