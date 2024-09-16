import { LayoutObjects } from "ttpg-darrell";

export class LayoutMapArea {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();
  }

  public getLayout(): LayoutObjects {
    return this._layout;
  }
}
