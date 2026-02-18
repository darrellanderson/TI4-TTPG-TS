import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutUnitBoxes } from "./layout-unit-boxes";
import {
  LayoutFighterContainers,
  LayoutInfantryContainers,
} from "../layout-fighter-inf-tg-containers";

export class LayoutUnitBoxesPlusTokens {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(false);

    const layoutTokenContainers: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true);
    layoutTokenContainers
      .add(new LayoutFighterContainers().getLayout().setIsVertical(true))
      .add(new LayoutInfantryContainers().getLayout().setIsVertical(true));

    const layoutUnitBoxes: LayoutObjects = new LayoutUnitBoxes(
      playerSlot
    ).getLayout();

    this._layout.add(layoutTokenContainers).add(layoutUnitBoxes);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
