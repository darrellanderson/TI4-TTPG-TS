import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { MapUI } from "./map-ui";

function go() {
  const mapString: string = "19 -110 -111 1";
  const mapUI = new MapUI(1, mapString);
  mapUI.setHexLabel("<0,0,0>", "Mecatol Rex Plus Some More Words");

  const widget: Widget = mapUI.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = mapUI.getSize().w + 4; // border
  screenUI.height = mapUI.getSize().h + 4;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
