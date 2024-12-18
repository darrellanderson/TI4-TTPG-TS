import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutTroveMat } from "./layout-trove-mat";
import { LayoutStatusPad } from "./layout-status-pad";
import { VerticalAlignment } from "@tabletop-playground/api";

export class LayoutRowTrovesAndStatusPad {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    if (playerSlot < 0) {
      throw new Error("must have a player slot");
    }

    const trove1: LayoutObjects = new LayoutTroveMat(playerSlot).getLayout();
    const trove2: LayoutObjects = new LayoutTroveMat(playerSlot).getLayout();
    const statusPad: LayoutObjects = new LayoutStatusPad(
      playerSlot
    ).getLayout();

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(false)
      .setVerticalAlignment(VerticalAlignment.Center)
      .add(trove1)
      .add(statusPad)
      .add(trove2);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
