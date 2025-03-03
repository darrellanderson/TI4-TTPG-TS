import { HorizontalAlignment, Text, Widget } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { VerticalUIBuilder } from "./vertical-ui-builder";

class MyAbstractUI extends AbstractUI {
  constructor() {
    const widget: Widget = new Text();
    super(widget, { w: 1, h: 7 });
  }
}

it("build 1", () => {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([new MyAbstractUI()])
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 1, h: 7 });
  abstractUi.destroy();
});

it("build 2", () => {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 1, h: 14 });
});

it("build 1 with spacing", () => {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([new MyAbstractUI()])
    .setSpacing(3)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 1, h: 7 });
});

it("build 2 with spacing", () => {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setSpacing(3)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 1, h: 17 });
});

it("build 1 with padding", () => {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([new MyAbstractUI()])
    .setPadding(5)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 11, h: 17 });
});

it("build 2 with padding", () => {
  const abstractUi: AbstractUI = new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setPadding(5)
    .build();
  expect(abstractUi.getWidget()).toBeDefined();
  expect(abstractUi.getSize()).toEqual({ w: 11, h: 24 });
});

it("vertical alignment: left", () => {
  new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setHorizontalAlignment(HorizontalAlignment.Left)
    .build();
});

it("vertical alignment: center", () => {
  new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setHorizontalAlignment(HorizontalAlignment.Center)
    .build();
});

it("vertical alignment: right", () => {
  new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setHorizontalAlignment(HorizontalAlignment.Right)
    .build();
});

it("override height", () => {
  new VerticalUIBuilder()
    .addUIs([new MyAbstractUI(), new MyAbstractUI()])
    .setOverrideHeight(100)
    .build();
});
