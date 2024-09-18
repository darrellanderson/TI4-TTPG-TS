import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutPlayerArea } from "../layout-player-area/layout-player-area";
import { LayoutScoringArea } from "../layout-scoring-area/layout-scoring-area";
import { LayoutTableContainers } from "../layout-table-containers/layout-table-containers";
import { LayoutTableDecks } from "../layout-table-decks/layout-table-decks";
import { LayoutMapArea } from "../layout-map-area/layout-map-area";
import { LayoutStrategyCards } from "../layout-strategy-cards/layout-strategy-cards";

export class LayoutAll {
  private readonly _layout: LayoutObjects;

  constructor(playerCount: number) {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(true);

    const top: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingWide
    );
    const middle: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingWide
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

    middle
      .add(new LayoutTableContainers().getLayout())
      .add(new LayoutScoringArea(playerCount).getLayout())
      .add(new LayoutTableDecks().getLayout())
      .add(new LayoutMapArea().getLayout())
      .add(new LayoutStrategyCards().getLayout());

    top.flip(false, true);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
