import { Player, world } from "@tabletop-playground/api";

/**
 * Use a consistent player name.
 */
export class PlayerName {
  getByPlayer(player: Player): string {
    return this.getBySlot(player.getSlot());
  }

  getBySlot(playerSlot: number): string {
    const colorName: string | undefined =
      TI4.playerColor.getSlotColorName(playerSlot);
    if (colorName) {
      return colorName;
    }

    const player: Player | undefined = world.getPlayerBySlot(playerSlot);
    if (player) {
      return player.getName();
    }

    return "???";
  }
}
