import { Widget } from "@tabletop-playground/api";

export type UI_SIZE = {
  w: number;
  h: number;
};

/**
 * Represent a single UI widget.
 *
 * Needing everything at constructor time is a bit of a pain, but it's the best
 * way to ensure that the UI is immutable.
 */
export abstract class AbstractUI {
  private readonly _widget: Widget;
  private readonly _width: number = 0;
  private readonly _height: number = 0;

  constructor(widget: Widget, size: UI_SIZE) {
    this._widget = widget;
    this._width = size.w;
    this._height = size.h;
  }

  getSize(): UI_SIZE {
    return { w: this._width, h: this._height };
  }

  getWidget(): Widget {
    return this._widget;
  }
}
