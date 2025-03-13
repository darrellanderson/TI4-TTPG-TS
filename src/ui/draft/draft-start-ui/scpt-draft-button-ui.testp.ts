import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { ScptDraftButtonUI } from "./scpt-draft-button-ui";
import { AbstractUI } from "ui/abstract-ui/abtract-ui";

function _goDirect() {
  const scale: number = 1;
  const year: string = "YEAR";
  const abstractUi: AbstractUI = new ScptDraftButtonUI(scale, year);
  const widget: Widget = abstractUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUi.getSize().w;
  screenUI.height = abstractUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(_goDirect, 100);
