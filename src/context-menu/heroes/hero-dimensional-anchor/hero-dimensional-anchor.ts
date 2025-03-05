import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

/**
 * Roll a die for all non-fighter ships in and adjacent to systems that contain
 * a dimensional tear; on a 1-3 capture the unit.
 *
 * Do not roll for ships *in* systems, if a player is blockading
 * none of their ships roll.
 *
 * Ugh, except if Nekro copies, the nekro versions do not count as blockade.
 */
export class HeroDimensionalAnchor extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "x";
    const customActionName: string = "*Dimensional Anchor";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {};
    super(cardNsidPrefix, customActionName, customActionHandler);
  }
}
