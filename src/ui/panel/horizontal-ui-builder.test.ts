import { Text, Widget } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { HorizontalUIBuilder } from "./horizontal-ui-builder";

class MyAbstractUI extends AbstractUI {
  constructor() {
    const widget: Widget = new Text();
    super(widget, { w: 1, h: 7 });
  }
}

it("build 1", () => {
  const abstractUi: AbstractUI = new HorizontalUIBuilder()
    .addUIs([new MyAbstractUI()])
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 1, h: 7 });
});

it("build 2", () => {
  const abstractUi: AbstractUI = new HorizontalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 2, h: 7 });
});

it("build 1 with spacing", () => {
  const abstractUi: AbstractUI = new HorizontalUIBuilder()
    .addUIs([new MyAbstractUI()])
    .setSpacing(3)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 1, h: 7 });
});

it("build 2 with spacing", () => {
  const abstractUi: AbstractUI = new HorizontalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setSpacing(3)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 5, h: 7 });
});

it("build 1 with padding", () => {
  const abstractUi: AbstractUI = new HorizontalUIBuilder()
    .addUIs([new MyAbstractUI()])
    .setPadding(5)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 11, h: 17 });
});

it("build 2 with padding", () => {
  const abstractUi: AbstractUI = new HorizontalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setPadding(5)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 12, h: 17 });
});
