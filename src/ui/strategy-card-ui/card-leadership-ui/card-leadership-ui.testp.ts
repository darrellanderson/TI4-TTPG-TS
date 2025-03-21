import { Border, ScreenUIElement, world } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CardLeadershipUI } from "./card-leadership-ui";

function go() {
  const scale: number = 1;
  const isPlay: boolean = true;
  const abstractUi: AbstractUI = new CardLeadershipUI(scale, isPlay);

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUi.getSize().w + 2;
  screenUI.height = abstractUi.getSize().h + 2;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(abstractUi.getWidget());

  world.addScreenUI(screenUI);
}

setTimeout(go, 100);
