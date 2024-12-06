import {
  Border,
  Color,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { MILTY_SLICE_SHAPE } from "../../../lib/draft-lib/drafts/milty";
import { SliceUI } from "./slice-ui";

function go() {
  const slice: Array<number> = [91, 22, 23, 24, 25];
  const color: Color = new Color(0.5, 0.5, 0.5, 1);
  const scale: number = 2;
  const sliceUI = new SliceUI(slice, MILTY_SLICE_SHAPE, color, scale);

  const widget: Widget = sliceUI.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = sliceUI.getSize().w;
  screenUI.height = sliceUI.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
