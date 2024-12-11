import { Text, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import {
  WRAPPED_BORDER_WIDTH,
  WrappedClickableUI,
} from "./wrapped-clickable-ui";

class MyAbstractUI extends AbstractUI {
  constructor() {
    const widget: Widget = new Text();
    super(widget, { w: 1, h: 2 });
  }
}

it("getSize", () => {
  const myAbstractUi: AbstractUI = new MyAbstractUI();
  const innerSize: UI_SIZE = myAbstractUi.getSize();
  expect(innerSize).toEqual({ w: 1, h: 2 });

  const scale: number = 1;
  const wrappedUi: WrappedClickableUI = new WrappedClickableUI(
    myAbstractUi,
    scale
  );
  const outserSize: UI_SIZE = wrappedUi.getSize();
  expect(outserSize).toEqual({
    w: 1 + WRAPPED_BORDER_WIDTH * 4 + 8,
    h: 2 + WRAPPED_BORDER_WIDTH * 4 + 8,
  });

  expect(wrappedUi.getBorder()).toBeDefined();
  expect(wrappedUi.getContentButton()).toBeDefined();
});

it("setOwningPlayerSlot", () => {
  const myAbstractUi: AbstractUI = new MyAbstractUI();
  const scale: number = 1;
  const wrappedUi: WrappedClickableUI = new WrappedClickableUI(
    myAbstractUi,
    scale
  );
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(-1);

  wrappedUi.setOwningPlayerSlot(1);
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(1);

  wrappedUi.setOwningPlayerSlot(undefined);
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(-1);

  wrappedUi.setOwningPlayerSlot(1);
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(1);

  wrappedUi.setOwningPlayerSlot(-1);
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(-1);
});
