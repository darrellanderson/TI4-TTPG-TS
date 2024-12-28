import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CombatUIPlanet } from "./combat-ui-planet";
import { Planet } from "../../../lib/system-lib/planet/planet";
import { System } from "../../../lib/system-lib/system/system";

function go() {
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system) {
    throw new Error("system is undefined");
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet is undefined");
  }

  const scale: number = 1;
  const abstractUi: AbstractUI = new CombatUIPlanet(planet, scale);

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

setTimeout(go, 1000);
