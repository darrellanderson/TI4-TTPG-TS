import { Container, GameObject, Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, GarbageHandler, NSID } from "ttpg-darrell";

import { Faction } from "../../faction-lib/faction/faction";
import { PlayerSeats } from "../../player-lib/player-seats/player-seats";
import { RecycleCardPromissory } from "../../recycle-lib/handlers/card/promissory/recycle-card-promissory";

export class AddCommandTokens {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();
  private readonly _playerSeats: PlayerSeats = new PlayerSeats();
  private readonly _recycleCardPromissory: GarbageHandler =
    new RecycleCardPromissory();

  getPlayerSlotToCommandTokenCount(): Map<number, number> {
    const slotToCount: Map<number, number> = new Map();

    // Seed each slot with 2.
    for (const seatEntry of this._playerSeats.getAllSeats()) {
      slotToCount.set(seatEntry.playerSlot, 2);
    }

    // "Versatile" faction ability adds a token.
    const slotToFaction: Map<number, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();
    for (const [slot, faction] of slotToFaction) {
      if (
        faction.getAbilityNsids().includes("faction-ability:base/versatile")
      ) {
        let count: number | undefined = slotToCount.get(slot);
        if (count !== undefined) {
          count += 1;
          slotToCount.set(slot, count);
        }
      }
    }

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (!this._cardUtil.isLooseCard(obj)) {
        continue;
      }
      const nsid: string = NSID.get(obj);

      // Add one if "Hyper Metabolism" technology.
      if (nsid === "card.technology.green:base/hyper-metabolism") {
        const owner: number = this._find.closestOwnedCardHolderOwner(
          obj.getPosition()
        );
        let count: number | undefined = slotToCount.get(owner);
        if (count !== undefined) {
          count += 1;
          slotToCount.set(owner, count);
        }
      }

      // Add one if "cybernetic enhancements" promissory.
      if (
        nsid.startsWith("card.promissory:") &&
        nsid.includes("/cybernetic-enhancements")
      ) {
        const owner: number = this._find.closestOwnedCardHolderOwner(
          obj.getPosition()
        );
        const faction: Faction | undefined = slotToFaction.get(owner);
        if (
          faction !== undefined &&
          !faction.getPromissoryNsids().includes(nsid)
        ) {
          let count: number | undefined = slotToCount.get(owner);
          if (count !== undefined) {
            count += 1;
            slotToCount.set(owner, count);
          }
          // Return card to the owner.
          if (this._recycleCardPromissory.canRecycle(obj)) {
            this._recycleCardPromissory.recycle(obj);
          }
        }
      }
    }
    return slotToCount;
  }

  /**
   * Add command tokens for each player.
   *
   * @returns Set of player slots where not all tokens were added (too few).
   */
  addAllCommandTokens(): Set<number> {
    const tooFewTokens: Set<number> = new Set();
    const slotToCount: Map<number, number> =
      this.getPlayerSlotToCommandTokenCount();
    for (const [slot, count] of slotToCount) {
      const success: boolean = this.addCommandTokens(slot, count);
      if (!success) {
        tooFewTokens.add(slot);
      }
    }
    return tooFewTokens;
  }

  /**
   * Move command tokens from the container to above the command sheet.
   *
   * @param playerSlot
   * @param count
   * @returns
   */
  addCommandTokens(playerSlot: number, count: number): boolean {
    let nsid: string;

    nsid = "container.token.command:base/generic";
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      playerSlot,
      skipContained
    );
    if (!container) {
      return false;
    }

    nsid = "sheet:base/command";
    const sheet: GameObject | undefined = this._find.findGameObject(
      nsid,
      playerSlot
    );
    if (!sheet) {
      return false;
    }

    let pos: Vector = new Vector(33, 16, 5);
    const commandTokens: Array<GameObject> = container.getItems();
    let successCount: number = 0;
    for (let i = 0; i < count; i++) {
      const commandToken: GameObject | undefined = commandTokens.shift();
      const showAnimation: boolean = false;
      const keep: boolean = false;
      if (
        commandToken !== undefined &&
        container.take(commandToken, pos, showAnimation, keep)
      ) {
        commandToken.snapToGround();
        successCount++;
      }
      pos = pos.add([0, 2, 0]);
    }

    return successCount === count;
  }
}
