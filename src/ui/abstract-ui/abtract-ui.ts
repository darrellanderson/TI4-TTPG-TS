import { Widget } from "@tabletop-playground/api";

export type UI_SIZE = {
  w: number;
  h: number;
};

export abstract class AbstractUI {
  protected _width: number = 0;
  protected _height: number = 0;

  constructor(size: UI_SIZE) {
    this._width = size.w;
    this._height = size.h;
  }

  getSize(): UI_SIZE {
    return { w: this._width, h: this._height };
  }

  abstract getWidget(): Widget;
}
