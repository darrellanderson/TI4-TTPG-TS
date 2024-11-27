import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { FactionUI } from "./faction-ui";
import { Faction } from "../../../lib/faction-lib/faction/faction";
function go() {
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsidName("arborec");
  if (!faction) {
    throw new Error("Faction not found");
  }

  const factionUi = new FactionUI(faction, 1);
  const widget: Widget = factionUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = factionUi.getSize().w;
  screenUI.height = factionUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
