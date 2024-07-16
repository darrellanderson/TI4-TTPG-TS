import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

export type CommandTokenAllocation = {
  tactic: Array<GameObject>;
  fleet: Array<GameObject>;
  strategy: Array<GameObject>;
};

export class CommandTokenLib {
  // Value that lets token be a little off sheet.
  private static readonly ON_SHEET_DISTANCE_SQ = 200;
  private _find: Find = new Find();

  constructor() {}

  public getPlayerSlotToCommandTokenAllocations(): Map<
    number,
    CommandTokenAllocation
  > {
    // Gather relevant objects.
    const commandSheets: Array<GameObject> = [];
    const commandTokens: Array<GameObject> = [];
    const skipContained = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "sheet:base/command") {
        commandSheets.push(obj);
      } else if (nsid === "token:base/command") {
        commandTokens.push(obj);
      }
    }

    // Organize command sheets, create a command token allocation for each.
    const playerSlotToCommandSheet: Map<number, GameObject> = new Map();
    for (const commandSheet of commandSheets) {
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(
        commandSheet.getPosition()
      );
      playerSlotToCommandSheet.set(playerSlot, commandSheet);
    }

    // Create command token allocations.
    const playerSlotToCommandTokenAllocation: Map<
      number,
      CommandTokenAllocation
    > = new Map();
    for (const playerSlot of playerSlotToCommandSheet.keys()) {
      playerSlotToCommandTokenAllocation.set(playerSlot, {
        tactic: [],
        fleet: [],
        strategy: [],
      });
    }

    // Assign command tokens to command token allocations.
    for (const commandToken of commandTokens) {
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(
        commandToken.getPosition()
      );
      const commandTokenAllocation: CommandTokenAllocation | undefined =
        playerSlotToCommandTokenAllocation.get(playerSlot);
      const commandSheet: GameObject | undefined =
        playerSlotToCommandSheet.get(playerSlot);

      if (commandTokenAllocation && commandSheet) {
        const worldPos: Vector = commandToken.getPosition();
        const localPos: Vector = commandSheet.worldPositionToLocal(worldPos);

        // COMMAND SHEET IS NOT CENTERED AT THE REGION CENTER.
        // Get the position of the token regions center.
        localPos.y -= 0.96;
        localPos.z = 0;

        const angle = (Math.atan2(localPos.y, localPos.x) * 180) / Math.PI;
        const dSq = localPos.magnitudeSquared();

        if (dSq <= CommandTokenLib.ON_SHEET_DISTANCE_SQ) {
          // Which region?
          if (-30 < angle && angle <= 30) {
            commandTokenAllocation.tactic.push(commandToken);
          } else if (30 < angle && angle <= 90) {
            commandTokenAllocation.fleet.push(commandToken);
          } else if (90 < angle && angle <= 150) {
            commandTokenAllocation.strategy.push(commandToken);
          }
        }
      }
    }

    return playerSlotToCommandTokenAllocation;
  }
}
