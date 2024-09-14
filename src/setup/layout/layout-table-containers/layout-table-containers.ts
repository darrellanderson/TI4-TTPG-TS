import { LayoutObjects } from "ttpg-darrell";

/**
 * Misc containers.
 */
export class LayoutTableContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();
  }

  public getLayout() {
    return this._layout;
  }
}
