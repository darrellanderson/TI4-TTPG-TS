import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { SingleTechUI } from "./single-tech-ui";
import { Tech } from "../../lib/tech-lib/tech/tech";

function go() {
  const scale: number = 1;
  const tech: Tech = TI4.techRegistry.getByNsid(
    "card.technology.blue:base/antimass-deflectors"
  )!;
  const abstractUi: AbstractUI = new SingleTechUI(scale, tech, undefined);

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
