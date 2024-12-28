import {
  Border,
  Player,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CombatUIAllSimple } from "./combat-ui-all-simple";
import { System } from "../../../lib/system-lib/system/system";

const player: Player | undefined = world.getAllPlayers()[0];

function go() {
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system) {
    throw new Error("system is undefined");
  }

  const scale: number = 1;
  const abstractUi: AbstractUI = new CombatUIAllSimple(scale);

  if (!player) {
    throw new Error("player is undefined");
  }
  TI4.onSystemActivated.trigger(system, player);

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
