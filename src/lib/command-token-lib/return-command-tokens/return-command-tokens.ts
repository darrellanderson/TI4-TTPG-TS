import { GameObject, Vector, world } from "@tabletop-playground/api";
import { HexType, NSID } from "ttpg-darrell";

import { RecycleTokenCommand } from "../../recycle-lib/handlers/token/recycle-token-command/recycle-token-command";

/**
 * Return command tokens on system tiles to players' supplies.
 */
export class ReturnCommandTokens {
  private readonly _recycleCommandToken: RecycleTokenCommand =
    new RecycleTokenCommand();

  getAllCommandTokensOnMap(): Array<GameObject> {
    const hexes: Set<HexType> = new Set();
    const commandTokens: Array<GameObject> = [];

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);

      if (nsid.startsWith("tile.system:")) {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        hexes.add(hex);
      }

      if (nsid.startsWith("token.command:")) {
        commandTokens.push(obj);
      }
    }
    return commandTokens.filter((commandToken) => {
      const pos: Vector = commandToken.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      return hexes.has(hex);
    });
  }

  /**
   * Return command tokens for only one player (for Sol's hero).
   *
   * @param playerSlot
   */
  returnOnePlayersCommandTokens(playerSlot: number): void {
    const commandTokens: Array<GameObject> =
      this.getAllCommandTokensOnMap().filter(
        (commandToken) => commandToken.getOwningPlayerSlot() === playerSlot
      );

    for (const commandToken of commandTokens) {
      if (this._recycleCommandToken.canRecycle(commandToken)) {
        this._recycleCommandToken.recycle(commandToken);
      }
    }
  }

  returnAllCommandTokens(): void {
    const commandTokens: Array<GameObject> = this.getAllCommandTokensOnMap();

    for (const commandToken of commandTokens) {
      if (this._recycleCommandToken.canRecycle(commandToken)) {
        this._recycleCommandToken.recycle(commandToken);
      }
    }
  }
}
