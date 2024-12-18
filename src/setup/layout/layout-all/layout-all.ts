import { LayoutObjects, LayoutObjectsSize } from "ttpg-darrell";

import { LayoutCombatArenaAndUnitBoxes } from "../layout-combat-arena/layout-combat-arena-and-unit-boxes";
import { LayoutConfig } from "../layout-config";
import { LayoutFighterInfTgContainers } from "../layout-fighter-inf-tg-containers/layout-fighter-inf-tg-containers";
import { LayoutMapArea } from "../layout-map-area/layout-map-area";
import { LayoutPlayerArea } from "../layout-player-area/layout-player-area";
import { LayoutScoringArea } from "../layout-scoring-area/layout-scoring-area";
import { LayoutStrategyCards } from "../layout-strategy-cards/layout-strategy-cards";
import { LayoutTableContainers } from "../layout-table-containers/layout-table-containers";
import { LayoutTableDecks } from "../layout-table-decks/layout-table-decks";
import { LayoutTableSystemTiles } from "../layout-table-system-tiles/layout-table-system-tiles";
import { LayoutQuickRoller } from "../layout-quick-roller/layout-quick-roller";
import { PlaceGenericHomeSystems } from "../layout-map-area/place-generic-home-systems";

export class LayoutAll {
  private readonly _layout: LayoutObjects;

  constructor(playerCount: number) {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(true);

    const top: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingWide
    );
    const left: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingExtraWide
    );
    const middle: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingExtraWide
    );
    const right: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingExtraWide
    );
    const bottom: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingWide
    );

    this._layout.add(top).add(middle).add(bottom);

    const topCount: number = Math.floor(playerCount / 2);
    for (let i = 0; i < playerCount; i++) {
      const whichLayout: LayoutObjects = i < topCount ? top : bottom;
      whichLayout.add(new LayoutPlayerArea(10 + i).getLayout());
    }

    left
      .add(new LayoutObjects().setOverrideWidth(50)) // force left to be wider than right
      .add(new LayoutTableContainers().getLayout())
      .add(new LayoutScoringArea(playerCount).getLayout())
      .add(new LayoutTableDecks().getLayout())
      .add(new LayoutFighterInfTgContainers().getLayout());
    right
      .add(new LayoutFighterInfTgContainers().getLayout())
      .add(new LayoutCombatArenaAndUnitBoxes().getLayout())
      .add(
        new LayoutObjects()
          .setChildDistance(LayoutConfig.spacingExtraWide)
          .setIsVertical(true)
          .add(new LayoutStrategyCards().getLayout())
          .add(new LayoutQuickRoller().getLayout())
      );

    // Top player areas invert vertical layout.
    top.flip(false, true);

    // Add left, middle, right to the middle section.
    // Pad hack to center on "middle" area (assumes left is wider).
    const leftSize: LayoutObjectsSize = left.calculateSize();
    const rightSize: LayoutObjectsSize = right.calculateSize();
    const pad: number =
      leftSize.w - rightSize.w - LayoutConfig.spacingExtraWide;
    right.add(new LayoutObjects().setOverrideWidth(pad));

    const numMapRings: number = playerCount <= 6 ? 4 : 5; // always add an extra ring
    middle.add(left).add(new LayoutMapArea(numMapRings).getLayout()).add(right);

    // Place system tiles.
    this._layout.addAfterLayout(() => {
      new LayoutTableSystemTiles()
        .getLayout()
        .doLayoutAtPoint(this._layout.getCenter(), 0);
    });

    // Place generic home systems (AFTER setting up player areas).
    this._layout.addAfterLayout(() => {
      new PlaceGenericHomeSystems().placeOrThrow();
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
