import { Card, ImageWidget, Widget } from "@tabletop-playground/api";
import { CreateZoomedUiType } from "./zoomable-ui";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export class ZoomedCardUI extends AbstractUI {
  constructor(card: Card, scale: number) {
    const extraScale: number = 2;
    const size: UI_SIZE = {
      w: 500 * scale * extraScale,
      h: 750 * scale * extraScale,
    };
    const widget: Widget = new ImageWidget()
      .setImageSize(size.w, size.h)
      .setSourceCard(card);
    super(widget, size);
  }
}

/**
 * UI generator for a card.
 */
export class CreateZoomedCardUI {
  private readonly _card: Card;

  constructor(card: Card) {
    this._card = card;
  }

  get(): CreateZoomedUiType {
    return (scale: number): AbstractUI => {
      return new ZoomedCardUI(this._card, scale);
    };
  }
}
