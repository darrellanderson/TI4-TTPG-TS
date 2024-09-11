import {
  CardHolder,
  DrawingLine,
  GameObject,
  ObjectType,
  Player,
  Vector,
  VerticalAlignment,
  world,
} from "@tabletop-playground/api";
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
      .setVerticalAlignment(VerticalAlignment.Top)
      .setPadding(6);

    // Left.
    const layoutUnitBoxes: LayoutObjects = new LayoutUnitBoxes(
      playerSlot
    ).getLayout();

    // Center top to bottom.
    const layoutSheets: LayoutObjects = new LayoutSheets(
      playerSlot
    ).getLayout();
    const layoutTokenContainers: LayoutObjects = new LayoutTokenContainers(
      playerSlot
    ).getLayout();
    const layoutSheetsAndTokenContainers: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(layoutSheets)
      .add(layoutTokenContainers);

    const layoutMats: LayoutObjects = new LayoutMats().getLayout();
    const cardHolder: GameObject = Spawn.spawnOrThrow(
      "card-holder:base/player-hand"
    );
    cardHolder.setOwningPlayerSlot(playerSlot);

    const center: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(layoutSheetsAndTokenContainers)
      .add(layoutMats)
      .add(cardHolder);

    this._layout.add(layoutUnitBoxes).add(center);

    this._layout.addAfterLayout(() => {
      cardHolder.setObjectType(ObjectType.Ground);

      const player: Player | undefined = world.getPlayerBySlot(playerSlot);
      if (player && cardHolder instanceof CardHolder) {
        player.setHandHolder(cardHolder);
      }
    });

    this._layout.addAfterLayout(() => {
      const lineTag: string = "player-area-" + playerSlot;

      for (const line of world.getDrawingLines()) {
        if (line.tag === lineTag) {
          world.removeDrawingLineObject(line);
        }
      }

      const center: Vector = this._layout.getCenter();
      center.z = world.getTableHeight() + 0.02;
      const wh: { w: number; h: number } = this._layout.calculateSize();
      const extent: Vector = new Vector(wh.h, wh.w, 0).multiply(0.5);
      const topLeft: Vector = center.subtract(extent);
      const topRight: Vector = center.add(new Vector(extent.x, -extent.y, 0));
      const botRight: Vector = center.add(extent);
      const botLeft: Vector = center.add(new Vector(-extent.x, extent.y, 0));

      const line: DrawingLine = new DrawingLine();
      line.points = [topLeft, topRight, botRight, botLeft, topLeft];
      line.thickness = 1;
      line.color = world.getSlotColor(playerSlot);
      line.tag = lineTag;
      world.addDrawingLine(line);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
