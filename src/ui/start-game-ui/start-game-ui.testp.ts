import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { StartGameUI } from "./start-game-ui";

function go() {
  const scale: number = 1;
  const abstractUi: AbstractUI = new StartGameUI(scale);

  const widget: Widget = abstractUi.getWidget();

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

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 100);
