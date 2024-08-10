import { GameObject, VerticalAlignment } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { LayoutMats } from "./layout-mats";
import { LayoutSheets } from "./layout-sheets";
import { LayoutTokenContainers } from "./layout-token-containers";
import { LayoutUnitBoxes } from "./layout-unit-boxes";

export class LayoutPlayerArea {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setVerticalAlignment(VerticalAlignment.Top);

    // Left.
    const layoutUnitBoxes: LayoutObjects = new LayoutUnitBoxes(
      playerSlot
    ).getLayout();

    // Center top to bottom.
    const layoutSheets: LayoutObjects = new LayoutSheets().getLayout();
    const layoutTokenContainers: LayoutObjects =
      new LayoutTokenContainers().getLayout();
    const layoutSheetsAndTokenContainers: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(layoutSheets)
      .add(layoutTokenContainers);

    const layoutMats: LayoutObjects = new LayoutMats().getLayout();
    const cardHolder: GameObject = Spawn.spawnOrThrow(
      "card-holder:base/player-hand"
    );

    const center: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(layoutSheetsAndTokenContainers)
      .add(layoutMats)
      .add(cardHolder);

    this._layout.add(layoutUnitBoxes).add(center);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
