import { LayoutObjects } from "ttpg-darrell";
import { LayoutUnitBoxes } from "../layout-player-area/layout-unit-boxes";
import { LayoutCombatArena } from "./layout-combat-arena";
import { LayoutConfig } from "../layout-config";
import { LayoutThundersEdgeComponents } from "./layout-thunders-edge-components";

export class LayoutCombatArenaAndUnitBoxes {
  private readonly _layout: LayoutObjects = new LayoutObjects();

  constructor() {
    const playerSlot: number = 19; // 19 for anonymous units
    const combatArena: LayoutCombatArena = new LayoutCombatArena();
    const unitBoxes: LayoutUnitBoxes = new LayoutUnitBoxes(playerSlot, 6);
    const thundersEdgeComponents: LayoutThundersEdgeComponents =
      new LayoutThundersEdgeComponents();

    this._layout
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(true)
      .add(combatArena.getLayout())
      .add(unitBoxes.getLayout())
      .add(thundersEdgeComponents.getLayout());
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
