import { Color, GameObject, Player, world } from "@tabletop-playground/api";
import { AbstractRightClickCard, Broadcast } from "ttpg-darrell";

/**
 * Sol hero Jace X. 4th Air Legion
 *
 * ACTION: Remove each of your command tokens from the game board and return
 * them to your reinforcements.
 *
 * Then, purge this card.
 */
export class HeroHelioCommandArray extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.leader.hero:pok/jace-x-4th-air-legion";
    const customActionName: string = "*Helio Command Array";
    const customActionHandler = (
      _object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._helioCommandArray(player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _helioCommandArray(playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Helio Command Array!`;
    Broadcast.chatAll(msg, color);

    // TODO
  }
}
