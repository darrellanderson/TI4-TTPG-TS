import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { MILTY_SLICE_SHAPE } from "../../lib/draft-lib/drafts/milty";
import { SliceUI } from "../draft/slice-ui/slice-ui";
import { WrappedClickableUI } from "./wrapped-clickable-ui";

function go() {
  const scale: number = 3;
  const innerUi: AbstractUI = new SliceUI(
    [21, 22, 23, 24, 25],
    MILTY_SLICE_SHAPE,
    scale
  );
  const wrappedUi = new WrappedClickableUI(innerUi, scale);
  wrappedUi.getBorder().setColor([1, 0, 0, 1]);
  const widget: Widget = wrappedUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = wrappedUi.getSize().w;
  screenUI.height = wrappedUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
