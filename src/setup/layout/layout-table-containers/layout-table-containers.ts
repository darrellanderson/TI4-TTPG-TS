import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutSystemContainer } from "./layout-system-container";
import { LayoutExplorationContainer } from "./layout-exploration-container";

/**
 * Misc containers.
 */
export class LayoutTableContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true);

    this._layout
      .add(new LayoutSystemContainer().getLayout())
      .add(new LayoutExplorationContainer().getLayout());
  }

  public getLayout() {
    return this._layout;
  }
}
