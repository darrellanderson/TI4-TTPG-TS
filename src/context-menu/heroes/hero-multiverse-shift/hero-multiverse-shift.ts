import { Color, GameObject, Player, world } from "@tabletop-playground/api";
import { AbstractRightClickCard, Broadcast } from "ttpg-darrell";
import { RightClickPurge } from "../../right-click-purge/right-click-purge";

/**
 * Empyrean hero Conservator Procyon
 *
 * ACTION: Place 1 frontier token in each system that does not contain any
 * planets and does not already have a frontier token.
 *
 * Then, explore each frontier token that is in a system that contains 1
 * or more of your ships.
 *
 * Then, purge this card.
 */
export class HeroMultiverseShift extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.leader.hero:pok/conservator-procyon";
    const customActionName: string = "*Multiverse Shift";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._multiverseShift(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _multiverseShift(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Multiverse Shift!`;
    Broadcast.chatAll(msg, color);

    // TODO

    new RightClickPurge()._purge(object, playerSlot);
  }
}
