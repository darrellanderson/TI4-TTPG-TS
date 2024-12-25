import { Border, ContentButton, Text, Widget } from "@tabletop-playground/api";
import { AbstractWrappedClickableUI } from "./abstract-wrapped-clickable-ui";

class MyAbstractWrappedClickableUI extends AbstractWrappedClickableUI {
  private readonly _contentButton = new ContentButton();
  private readonly _border = new Border();

  constructor() {
    const widget: Widget = new Text();
    super(widget, { w: 1, h: 2 });
  }

  getContentButton(): ContentButton {
    return this._contentButton;
  }

  getBorder(): Border {
    return this._border;
  }
}

it("setOwningPlayerSlot", () => {
  const wrappedUi: AbstractWrappedClickableUI =
    new MyAbstractWrappedClickableUI();
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
