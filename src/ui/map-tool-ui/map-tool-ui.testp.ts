import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { MapToolUI } from "./map-tool-ui";

function go() {
  const scale: number = 1;

  const abstractUI: AbstractUI = new MapToolUI(scale);
  const widget: Widget = abstractUI.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUI.getSize().w + 4; // border
  screenUI.height = abstractUI.getSize().h + 4;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
