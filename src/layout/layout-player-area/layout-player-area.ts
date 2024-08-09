import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";

export class LayoutPlayerArea {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects().setChildDistance(LayoutConfig.spacing);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
