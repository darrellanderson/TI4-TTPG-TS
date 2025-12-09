import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { DraftBagUI } from "./draft-bag-ui";

function _goDirect() {
  const scale: number = 1;
  const drafBagUi = new DraftBagUI(scale);
  const widget: Widget = drafBagUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = drafBagUi.getSize().w;
  screenUI.height = drafBagUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(_goDirect, 100);
