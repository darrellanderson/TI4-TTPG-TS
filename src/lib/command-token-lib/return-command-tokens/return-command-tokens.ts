import { GameObject, Vector, world } from "@tabletop-playground/api";
import { HexType, NSID } from "ttpg-darrell";

import { RecycleTokenCommand } from "../../recycle-lib/handlers/token/recycle-token-command/recycle-token-command";

export class ReturnCommandTokens {
  private readonly _recycleCommandToken: RecycleTokenCommand =
    new RecycleTokenCommand();

  returnAllCommandTokens(): void {
    // Only return command tokens on system tiles.
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

      if (nsid.startsWith("token:base/command")) {
        commandTokens.push(obj);
      }
    }

    for (const commandToken of commandTokens) {
      const pos: Vector = commandToken.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      if (
        hexes.has(hex) &&
        this._recycleCommandToken.canRecycle(commandToken)
      ) {
        this._recycleCommandToken.recycle(commandToken);
      }
    }
  }
}
