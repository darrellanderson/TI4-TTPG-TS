import { ScreenUIElement, Widget, world } from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { KeleresUI } from "./keleres-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
function go() {
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsidName("arborec");
  if (!faction) {
    throw new Error("Faction not found");
  }

  const draftState = new DraftState("@test/test");

  const keleresUi = new KeleresUI(draftState, 1);
  const widget: Widget = keleresUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = keleresUi.getSize().w;
  screenUI.height = keleresUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = widget;

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
