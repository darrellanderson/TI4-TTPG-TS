import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";

import { MapUI } from "../map-ui/map-ui";
import { CreateZoomedUiType } from "./zoomable-ui";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ZoomableUiFullyClickable } from "./zoomable-ui-fully-clickable";

function go() {
  const mapString: string = "19 -110 -111 1 91";
  const hexToLabel: Map<HexType, string> = new Map();
  const scale: number = 1;
  const mapUi: AbstractUI = new MapUI(mapString, hexToLabel, scale);

  const createZoomedUI: CreateZoomedUiType = (newScale: number): AbstractUI => {
    console.log("createZoomedUI", newScale);
    return new MapUI(mapString, hexToLabel, newScale * 3);
  };

  const zoomableUi: AbstractUI = new ZoomableUiFullyClickable(
    mapUi,
    scale,
    createZoomedUI
  );
  const widget: Widget = zoomableUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = zoomableUi.getSize().w + 4; // border
  screenUI.height = zoomableUi.getSize().h + 4;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
