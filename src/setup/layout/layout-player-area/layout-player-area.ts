import {
  CardHolder,
  GameObject,
  ObjectType,
  Player,
  VerticalAlignment,
  world,
} from "@tabletop-playground/api";
import { LayoutBorder, LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { LayoutMats } from "./layout-mats";
import { LayoutSheets } from "./layout-sheets";
import { LayoutTokenContainers } from "./layout-token-containers";
import { LayoutUnitBoxes } from "./layout-unit-boxes";

export class LayoutPlayerArea {
  private readonly _layout: LayoutBorder;

  constructor(playerSlot: number) {
    const innerLayout: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .setVerticalAlignment(VerticalAlignment.Top);

    // Center top to bottom.
    const layoutUnitBoxes: LayoutObjects = new LayoutUnitBoxes(
      playerSlot
    ).getLayout();
    const layoutSheets: LayoutObjects = new LayoutSheets(
      playerSlot
    ).getLayout();
    const layoutTokenContainers: LayoutObjects = new LayoutTokenContainers(
      playerSlot
    ).getLayout();
    const topRow: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(layoutUnitBoxes)
      .add(layoutSheets)
      .add(layoutTokenContainers);

    const layoutMats: LayoutObjects = new LayoutMats().getLayout();
    const cardHolder: GameObject = Spawn.spawnOrThrow(
      "card-holder:base/player-hand"
    );
    cardHolder.setOwningPlayerSlot(playerSlot);

    innerLayout.add(topRow).add(layoutMats).add(cardHolder);

    innerLayout.addAfterLayout(() => {
      cardHolder.setObjectType(ObjectType.Ground);

      const player: Player | undefined = world.getPlayerBySlot(playerSlot);
      if (player && cardHolder instanceof CardHolder) {
        player.setHandHolder(cardHolder);
      }
    });

    // Inner layout must be complete to measure size correctly.
    const padding: number = LayoutConfig.spacingWide;
    this._layout = new LayoutBorder(innerLayout, padding)
      .setPlayerSlot(playerSlot)
      .setOutlineWidth(1);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
