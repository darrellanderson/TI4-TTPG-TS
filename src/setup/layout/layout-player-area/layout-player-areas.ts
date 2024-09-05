import { VerticalAlignment } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

import { LayoutPlayerArea } from "./layout-player-area";
import { LayoutConfig } from "../layout-config";

export class LayoutPlayerAreas {
  private readonly _layout: LayoutObjects;

  constructor(playerCount: number) {
    const top: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(false)
      .setVerticalAlignment(VerticalAlignment.Bottom);

    const middle: LayoutObjects = new LayoutObjects().setOverrideHeight(100);

    const bottom: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(false)
      .setVerticalAlignment(VerticalAlignment.Bottom);

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(true)
      .add(top)
      .add(middle)
      .add(bottom);

    const topCount: number = Math.floor(playerCount / 2);
    for (let i = 0; i < playerCount; i++) {
      const whichLayout: LayoutObjects = i < topCount ? top : bottom;
      whichLayout.add(new LayoutPlayerArea(10 + i).getLayout());
    }

    top.flip(false, true);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
