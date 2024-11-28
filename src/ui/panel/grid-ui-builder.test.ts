import { Text, Widget } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { GridUIBuilder } from "./grid-ui-builder";

class MyAbstractUI extends AbstractUI {
  constructor() {
    const widget: Widget = new Text();
    super(widget, { w: 1, h: 7 });
  }
}

it("build 1x1", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI()])
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 1, h: 7 });
});

it("build 1x1 with padding", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI()])
    .setPadding(5)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 11, h: 17 });
});

it("build 2x1", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 2, h: 7 });
});

it("build 1x2", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setMaxRows(100)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 1, h: 14 });
});

it("build 2x2", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI(), new MyAbstractUI(), new MyAbstractUI()])
    .setMaxRows(2)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 2, h: 14 });
});

it("build 1x1 with spacing", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI()])
    .setSpacing(3)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 1, h: 7 });
});

it("build 2x1 with spacing", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setSpacing(3)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 5, h: 7 });
});

it("build 1x2 with spacing", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setMaxRows(100)
    .setSpacing(3)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 1, h: 17 });
});

it("build 2x2 with spacing", () => {
  const gridUi: AbstractUI = new GridUIBuilder<MyAbstractUI>()
    .addUIs([new MyAbstractUI(), new MyAbstractUI(), new MyAbstractUI()])
    .setMaxRows(2)
    .setSpacing(3)
    .build();
  expect(gridUi.getWidget()).toBeDefined();
  expect(gridUi.getSize()).toEqual({ w: 5, h: 17 });
});
