import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { SeatUI } from "./seat-ui";

function go() {
  const seatIndex: number = 0;
  const speakerIndex: number = 0;
  const scale: number = 1;
  const seatUi = new SeatUI(seatIndex, speakerIndex, scale);
  const widget: Widget = seatUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = seatUi.getSize().w;
  screenUI.height = seatUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
