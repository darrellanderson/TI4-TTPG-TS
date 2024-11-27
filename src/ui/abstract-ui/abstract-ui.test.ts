import { Text, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "./abtract-ui";

class MyAbstractUI extends AbstractUI {
  constructor() {
    const widget: Widget = new Text();
    super(widget, { w: 1, h: 2 });
  }
}

it("getSize", () => {
  const myAbstractUi = new MyAbstractUI();
  const size: UI_SIZE = myAbstractUi.getSize();
  expect(size).toEqual({ w: 1, h: 2 });
});

it("getWidget", () => {
  const myAbstractUi = new MyAbstractUI();
  const widget: Widget = myAbstractUi.getWidget();
  expect(widget).toBeDefined();
});
