import {
  CardHolder,
  Color,
  GameObject,
  HiddenCardsType,
  ObjectType,
  Player,
  VerticalAlignment,
  world,
} from "@tabletop-playground/api";
import {
  ColorLib,
  ColorsType,
  LayoutBorder,
  LayoutObjects,
  Spawn,
} from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { LayoutMats } from "./layout-mats";
import { LayoutSheets } from "./layout-sheets";
import { LayoutTokenContainers } from "./layout-token-containers";
import { LayoutUnitBoxes } from "./layout-unit-boxes";
import { LayoutStatusPad } from "./layout-status-pad";

export class LayoutPlayerArea {
  private readonly _layout: LayoutBorder;

  constructor(playerSlot: number) {
    const innerLayout: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .setVerticalAlignment(VerticalAlignment.Top);

    // Status pad alone at very top, gives players' a little space too.
    const statusPad: LayoutObjects = new LayoutStatusPad(
      playerSlot
    ).getLayout();

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
    if (cardHolder instanceof CardHolder) {
      cardHolder.setHiddenCardsType(HiddenCardsType.Back);
    }

    innerLayout.add(statusPad).add(topRow).add(layoutMats).add(cardHolder);

    innerLayout.addAfterLayout(() => {
      cardHolder.setObjectType(ObjectType.Ground);

      const player: Player | undefined = world.getPlayerBySlot(playerSlot);
      if (player && cardHolder instanceof CardHolder) {
        player.setHandHolder(cardHolder);
      }
    });

    // Inner layout must be complete to measure size correctly.
    const colorLib: ColorLib = new ColorLib();
    const colorsType: ColorsType =
      colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
    const color: Color = colorLib.parseColorOrThrow(colorsType.widget);
    const padding: number = LayoutConfig.spacingWide;
    this._layout = new LayoutBorder(innerLayout, padding)
      .setColor(color)
      .setOutlineWidth(1)
      .setTag(`player-area-${playerSlot}`);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
