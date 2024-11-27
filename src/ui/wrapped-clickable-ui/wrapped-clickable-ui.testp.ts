import {
  Border,
  ScreenUIElement,
  Text,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { WrappedClickableUI } from "./wrapped-clickable-ui";

class MyAbstractUI extends AbstractUI {
  constructor() {
    const widget: Widget = new Text().setText("Hello");
    super(widget, { w: 100, h: 200 });
  }
}

function go() {
  const innerUi: AbstractUI = new MyAbstractUI();
  const scale: number = 1;
  const wrappedUi = new WrappedClickableUI(innerUi, scale);
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
