import { GameObject, Player, world } from "@tabletop-playground/api";
import { AbstractRightClickCard, Facing, NSID } from "ttpg-darrell";

const ACTION_REPAIR_ALL_UNITS: string = "*Repair damaged units";

/**
 * Right click menu to repair all units of the clicking player's color.
 */
export class RightClickTFNanomachines extends AbstractRightClickCard {
  constructor() {
    const nsid: string = "card.tf-ability:twilights-fall/nanomachines";
    const customActionHandler = (
      _object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_REPAIR_ALL_UNITS) {
        const playerColorHex: string = world
          .getSlotColor(player.getSlot())
          .toHex();
        const skipContained: boolean = true;
        for (const obj of world.getAllObjects(skipContained)) {
          const objNsid: string = NSID.get(obj);
          if (objNsid.startsWith("unit:")) {
            const isOwnedByPlayer: boolean =
              obj.getPrimaryColor().toHex() === playerColorHex;
            if (isOwnedByPlayer && !Facing.isFaceUp(obj)) {
              obj.flipOrUpright();
            }
          }
        }
      }
    };
    super(nsid, ACTION_REPAIR_ALL_UNITS, customActionHandler);

    this.setTooltip(ACTION_REPAIR_ALL_UNITS, "Repair all your damaged units.");
  }
}
