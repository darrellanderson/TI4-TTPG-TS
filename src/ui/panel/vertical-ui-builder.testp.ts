import {
  Border,
  ScreenUIElement,
  Text,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "ui/abstract-ui/abtract-ui";
import { VerticalUIBuilder } from "./vertical-ui-builder";

class MyAbstractUI extends AbstractUI {
  constructor(value: string) {
    const widget: Widget = new Border()
      .setColor([0, 0, 0, 1])
      .setChild(new Text().setTextColor([1, 1, 1, 1]).setText(value));
    super(widget, { w: 100, h: 50 });
  }
}

function go() {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([
      new MyAbstractUI("1"),
      new MyAbstractUI("2"),
      new MyAbstractUI("3"),
      new MyAbstractUI("4"),
      new MyAbstractUI("5"),
    ])
    .setSpacing(10)
    .setPadding(10)
    .build();

  const widget: Widget = abstractUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUi.getSize().w + 4; // border
  screenUI.height = abstractUi.getSize().h + 4;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(go, 1000);
