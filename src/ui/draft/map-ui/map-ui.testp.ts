import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { MapUI } from "./map-ui";
import { SliceTiles } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { MILTY_SLICE_SHAPE } from "lib/draft-lib/drafts/milty";

function go() {
  const mapUI = new MapUI(1, MILTY_SLICE_SHAPE);

  const seatIndexToSliceTiles: Map<number, SliceTiles> = new Map();
  const seatIndexToFaction: Map<number, Faction> = new Map();
  const setIndexToPlayerName: Map<number, string> = new Map();

  seatIndexToSliceTiles.set(2, [21, 22, 23, 24, 25]);

  const arborec = TI4.factionRegistry.getByNsid("faction:base/arborec")!;
  if (!arborec) {
    throw new Error("arborec not found");
  }
  seatIndexToFaction.set(1, arborec);

  const widget: Widget = mapUI.getWidget(
    seatIndexToSliceTiles,
    seatIndexToFaction,
    setIndexToPlayerName
  );

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = mapUI.getSize().w;
  screenUI.height = mapUI.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
