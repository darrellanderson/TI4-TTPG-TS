import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { SliceTiles } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { MILTY_SLICE_SHAPE } from "../../../lib/draft-lib/drafts/milty";
import { MapUI } from "../../../ui/map-ui/map-ui";
import { DraftToMapString } from "./draft-to-map-string";
import { MapStringLoad } from "../../map-string-lib/map-string/map-string-load";

function go() {
  const seatIndexToSliceTiles: Map<number, SliceTiles> = new Map();
  const seatIndexToFaction: Map<number, Faction> = new Map();
  const setIndexToPlayerName: Map<number, string> = new Map();

  seatIndexToSliceTiles.set(1, [21, 22, 23, 24, 25]);
  seatIndexToSliceTiles.set(2, [31, 32, 33, 34, 35]);

  const arborec = TI4.factionRegistry.getByNsid("faction:base/arborec")!;
  if (!arborec) {
    throw new Error("arborec not found");
  }
  seatIndexToFaction.set(1, arborec);

  const { mapString, hexToPlayerName } = new DraftToMapString(
    MILTY_SLICE_SHAPE
  ).buildMapString(
    seatIndexToSliceTiles,
    seatIndexToFaction,
    setIndexToPlayerName
  );
  console.log("xxx", mapString);
  new MapStringLoad().load(mapString);

  const mapUI = new MapUI(mapString, hexToPlayerName, 1);

  const widget: Widget = mapUI.getWidget();

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
