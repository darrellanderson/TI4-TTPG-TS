import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

export type CommandTokenCounts = {
  tactic: Array<GameObject>;
  fleet: Array<GameObject>;
  strategy: Array<GameObject>;
};

export class CommandTokenCounter {
  // Value that lets token be a little off sheet.
  private static readonly ON_SHEET_DISTANCE_SQ = 200;
  private _find: Find = new Find();

  public getPlayerSlotToCommandTokenCounts(): Map<number, CommandTokenCounts> {
    // Gather relevant objects in a single pass.
    const commandSheets: Array<GameObject> = [];
    const commandTokens: Array<GameObject> = [];
    const skipContained = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "sheet:base/command") {
        commandSheets.push(obj);
      } else if (nsid.startsWith("token.command:")) {
        commandTokens.push(obj);
      }
    }

    // Organize command sheets, create a command token allocation for each.
    // Assumes only one command sheet per player.
    const playerSlotToCommandSheet: Map<number, GameObject> = new Map();
    for (const commandSheet of commandSheets) {
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(
        commandSheet.getPosition(),
      );
      playerSlotToCommandSheet.set(playerSlot, commandSheet);
    }

    // Create command token allocations.
    const playerSlotToCommandTokenCounts: Map<number, CommandTokenCounts> =
      new Map();
    for (const playerSlot of playerSlotToCommandSheet.keys()) {
      playerSlotToCommandTokenCounts.set(playerSlot, {
        tactic: [],
        fleet: [],
        strategy: [],
      });
    }

    // Assign command tokens to command token allocations.
    for (const commandToken of commandTokens) {
      // Tokens owned by other players may be on another player's sheet.
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(
        commandToken.getPosition(),
      );
      const commandTokenCounts: CommandTokenCounts | undefined =
        playerSlotToCommandTokenCounts.get(playerSlot);
      const commandSheet: GameObject | undefined =
        playerSlotToCommandSheet.get(playerSlot);

      if (commandTokenCounts && commandSheet) {
        const worldPos: Vector = commandToken.getPosition();
        const localPos: Vector = commandSheet.worldPositionToLocal(worldPos);

        // Get the position of the token regions center.
        localPos.y -= 0.96;
        localPos.z = 0;

        const angle = (Math.atan2(localPos.y, localPos.x) * 180) / Math.PI;
        const dSq = localPos.magnitudeSquared();

        if (dSq <= CommandTokenCounter.ON_SHEET_DISTANCE_SQ) {
          // Which region?
          if (-30 < angle && angle <= 30) {
            commandTokenCounts.tactic.push(commandToken);
          } else if (30 < angle && angle <= 90) {
            commandTokenCounts.fleet.push(commandToken);
          } else if (90 < angle && angle <= 150) {
            commandTokenCounts.strategy.push(commandToken);
          }
        }
      }
    }

    return playerSlotToCommandTokenCounts;
  }
}
