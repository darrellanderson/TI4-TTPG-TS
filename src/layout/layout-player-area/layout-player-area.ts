import { LayoutObjects, Spawn } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutUnitBoxes } from "./layout-unit-boxes";
import { LayoutMats } from "./layout-mats";
import { LayoutSheets } from "./layout-sheets";
import { LayoutTokenContainers } from "./layout-token-containers";
import { VerticalAlignment } from "@tabletop-playground/api";

export class LayoutPlayerArea {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    this._layout = new LayoutObjects().setChildDistance(LayoutConfig.spacing);

    // Left.
    const layoutUnitBoxes = new LayoutUnitBoxes(playerSlot);
    const left = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setVerticalAlignment(VerticalAlignment.Top)
      .add(layoutUnitBoxes.getLayout());

    // Center top to bottom.
    const layoutSheets = new LayoutSheets();
    const layoutMats = new LayoutMats();
    const cardHolder = Spawn.spawnOrThrow("card-holder:base/hand");
    const center = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .setVerticalAlignment(VerticalAlignment.Top)
      .add(layoutSheets.getLayout())
      .add(layoutMats.getLayout())
      .add(cardHolder);

    // Right.
    const layoutTokenContainers = new LayoutTokenContainers();
    const right = layoutTokenContainers
      .getLayout()
      .setVerticalAlignment(VerticalAlignment.Top);

    this._layout = new LayoutObjects().add(left).add(center).add(right);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
