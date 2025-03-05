import { Color, GameObject, Player, world } from "@tabletop-playground/api";
import { AbstractRightClickCard, Broadcast } from "ttpg-darrell";
import { RightClickPurge } from "../../right-click-purge/right-click-purge";

/**
 * Vuil'Raith hero It Feeds on Carrion
 *
 * ACTION: Each other player rolls a die for each of their non-fighter ships
 * that are in or adjacent to a system that contains a dimensional tear; on a
 * 1-3, capture that unit.
 *
 * If this causes a player's ground forces or fighters to be removed, also
 * capture those units.
 *
 * Then, purge this card.
 *
 * NOTES:
 *
 * Do not roll for ships *in* systems, if a player is blockading
 * none of their ships roll.
 *
 * Ugh, except if Nekro copies, the nekro versions do not count as blockade.
 */
export class HeroDimensionalAnchor extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.leader.hero:pok/it-feeds-on-carrion";
    const customActionName: string = "*Dimensional Anchor";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._dimensionalAnchor(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _dimensionalAnchor(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Dimensional Anchor!`;
    Broadcast.chatAll(msg, color);

    // TODO

    new RightClickPurge()._purge(object, playerSlot);
  }
}
