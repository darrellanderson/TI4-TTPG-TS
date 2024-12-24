import { ScreenUIElement, Widget, world } from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { KeleresUI } from "./keleres-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { WrappedClickableUI } from "ui/wrapped-clickable-ui/wrapped-clickable-ui";
function go() {
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsidName("arborec");
  if (!faction) {
    throw new Error("Faction not found");
  }

  const draftState = new DraftState("@test/test");

  const keleresUi = new KeleresUI(draftState, 1);
  const wrappedClickableUI = new WrappedClickableUI(keleresUi, 1);
  const widget: Widget = wrappedClickableUI.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = wrappedClickableUI.getSize().w;
  screenUI.height = wrappedClickableUI.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = widget;

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
