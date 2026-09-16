import { Color, GameObject, Player, world } from "@tabletop-playground/api";
import { AbstractRightClickCard, Broadcast } from "ttpg-darrell";
import { ReturnCommandTokens } from "../../../lib/command-token-lib/return-command-tokens/return-command-tokens";
import { RightClickPurge } from "../../right-click-purge/right-click-purge";

/**
 * Sol Paradigm Twilight Directive
 *
 * ACTION: Remove each of your command tokens from the game board and return
 * them to your reinforcements.
 *
 * Then, purge this card.
 */
export class ParadigmTwilightDirective extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.tf-paradigm:twilights-fall/twilight-directive";
    const customActionName: string = "*Twilight Directive";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._paradigmTwilightDirective(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _paradigmTwilightDirective(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Twilight Directive!`;
    Broadcast.chatAll(msg, color);

    new ReturnCommandTokens().returnOnePlayersCommandTokens(playerSlot);
    new RightClickPurge()._purge(object, playerSlot);
  }
}
