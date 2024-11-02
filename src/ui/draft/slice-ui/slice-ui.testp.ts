import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { MILTY_SLICE_SHAPE } from "lib/draft-lib/drafts/milty";
import { SliceUI } from "./slice-ui";

function go() {
  const sliceUI = new SliceUI(1, MILTY_SLICE_SHAPE);
  console.log(`sliceUI size: ${sliceUI.getWidth()} x ${sliceUI.getHeight()}`);

  const widget: Widget = sliceUI.getWidget([21, 22, 23, 24, 25]);

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = sliceUI.getWidth();
  screenUI.height = sliceUI.getHeight();
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
