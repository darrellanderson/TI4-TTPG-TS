import { globalEvents, Player, world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { OnWhisper } from "../on-whisper/on-whisper";

/**
 * If a public chat message contains "@<player-name-prefix>",
 * chirp at that player.
 */
export class OnChatMessage implements IGlobal {
  private readonly _onChatMessage = (
    _sender: Player,
    message: string
  ): void => {
    const parts: Array<string> = message.split(" ");
    parts.forEach((part: string): void => {
      if (part.startsWith("@")) {
        const playerName: string = part.substring(1).toLowerCase();
        for (const player of world.getAllPlayers()) {
          if (player.getName().toLowerCase().startsWith(playerName)) {
            OnWhisper.chirpAtPlayer(player);
          }
        }
      }
    });
  };

  init(): void {
    globalEvents.onChatMessage.add(this._onChatMessage);
  }
}
