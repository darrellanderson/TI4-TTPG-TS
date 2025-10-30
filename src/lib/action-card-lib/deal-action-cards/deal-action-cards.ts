import { Card, world } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";

import { Faction } from "../../faction-lib/faction/faction";
import { PlayerSeats } from "../../player-lib/player-seats/player-seats";

export class DealActionCards {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();
  private readonly _playerSeats: PlayerSeats = new PlayerSeats();

  getPlayerSlotToActionCardCount(): Map<number, number> {
    const slotToCount: Map<number, number> = new Map();

    // Seed with 1.
    for (const seatEntry of this._playerSeats.getAllSeats()) {
      slotToCount.set(seatEntry.playerSlot, 1);
    }

    // "Scheming" faction ability adds a card.
    const slotToFaction: Map<number, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();
    for (const [slot, faction] of slotToFaction) {
      if (faction.getAbilityNsids().includes("faction-ability:base/scheming")) {
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

      // Add one if "Neural Motivator" technology.
      if (nsid === "card.technology.green:base/neural-motivator") {
        const owner: number = this._find.closestOwnedCardHolderOwner(
          obj.getPosition()
        );
        let count: number | undefined = slotToCount.get(owner);
        if (count !== undefined) {
          count += 1;
          slotToCount.set(owner, count);
        }
      }

      // Add one if tf inheritance systems.
      if (nsid === "card.tf-ability:twilights-fall/inheritance-systems") {
        const owner: number = this._find.closestOwnedCardHolderOwner(
          obj.getPosition()
        );
        let count: number | undefined = slotToCount.get(owner);
        if (count !== undefined) {
          count += 1;
          slotToCount.set(owner, count);
        }
      }

      // Add one if tf scheming.
      if (nsid === "card.tf-ability:twilights-fall/scheming") {
        const owner: number = this._find.closestOwnedCardHolderOwner(
          obj.getPosition()
        );
        let count: number | undefined = slotToCount.get(owner);
        if (count !== undefined) {
          count += 1;
          slotToCount.set(owner, count);
        }
      }
    }

    return slotToCount;
  }

  /**
   * Deal action cards to players.
   *
   * @returns Set of player slots that did not receive enough cards.
   */
  dealAllActionCards(): Set<number> {
    const tooFewCards: Set<number> = new Set();
    for (const [slot, count] of this.getPlayerSlotToActionCardCount()) {
      if (!this.dealActionCards(slot, count)) {
        tooFewCards.add(slot);
      }
    }
    return tooFewCards;
  }

  /**
   * Deal action cards to a player.
   *
   * @param playerSlot
   * @param count
   */
  dealActionCards(playerSlot: number, count: number): boolean {
    for (let i = 0; i < count; i++) {
      // Find deck.
      const deckSnapPointTag: string = "deck-action";
      const discardSnapPointTag: string = "discard-action";
      const shuffleDiscard: boolean = true;
      let deck: Card | undefined = this._find.findDeckOrDiscard(
        deckSnapPointTag,
        discardSnapPointTag,
        shuffleDiscard
      );
      if (deck === undefined) {
        return false;
      }

      // Draw a card.
      let card: Card | undefined;
      if (deck.getStackSize() > 1) {
        const takeCount: number = 1;
        const fromFront: boolean = true;
        const offset: number = 0;
        const keep: boolean = false;
        card = deck.takeCards(takeCount, fromFront, offset, keep);
      } else {
        // Last card, use it and release the deck.
        card = deck;
        deck = undefined;
      }
      if (
        card !== undefined &&
        !this._cardUtil.dealToHolder(card, playerSlot)
      ) {
        return false;
      }
    }
    return true;
  }
}
