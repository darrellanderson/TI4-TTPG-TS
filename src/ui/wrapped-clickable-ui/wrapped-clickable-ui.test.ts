import { Text, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { BORDER_SIZE, WrappedClickableUI } from "./wrapped-clickable-ui";

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
    w: 1 + BORDER_SIZE * 2,
    h: 2 + BORDER_SIZE * 2,
  });
});

it("owningPlayerSlot", () => {
  const myAbstractUi: AbstractUI = new MyAbstractUI();
  const scale: number = 1;
  const wrappedUi: WrappedClickableUI = new WrappedClickableUI(
    myAbstractUi,
    scale
  );
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(-1);

  wrappedUi.setOwningPlayerSlot(1);
  expect(wrappedUi.getOwningPlayerSlot()).toEqual(1);

  wrappedUi.maybeToggleOwningPlayerSlot(1);
  wrappedUi.setOwningPlayerSlot(-1);

  wrappedUi.maybeToggleOwningPlayerSlot(1);
  wrappedUi.setOwningPlayerSlot(1);

  wrappedUi.maybeToggleOwningPlayerSlot(2);
  wrappedUi.setOwningPlayerSlot(1);
});
