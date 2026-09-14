import { Card, Vector, world } from "@tabletop-playground/api";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { CardUtil, Find, NSID } from "ttpg-darrell";

export class UpdatorPlayerRelics implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const relicCards: Array<Card> = this._getLooseRelicCards();

    gameData.players.forEach(
      (playerData: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: number =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);

        const myRelicCards: Array<Card> = relicCards.filter(
          (relicCard: Card) => {
            const closestPlayerSlot: number =
              this._getRelicCardClosestPlayerSlot(relicCard);
            return closestPlayerSlot === playerSlot;
          }
        );

        const myRelics: Array<string> = myRelicCards
          .map((relicCard: Card): string => {
            return relicCard.getCardDetails().name.replace(/ \(\d+\)$/, "");
          })
          .filter((name: string) => name !== "");

        playerData.relics = myRelics;
      }
    );
  }

  /**
   * Find relic cards loose on the table.
   *
   * @returns
   */
  _getLooseRelicCards(): Array<Card> {
    const skipContained: boolean = true;
    const cardUtil: CardUtil = new CardUtil();
    const relicCards: Array<Card> = [];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        (nsid.startsWith("card.relic:") || nsid.includes("relic-fragment")) &&
        obj instanceof Card &&
        cardUtil.isLooseCard(obj)
      ) {
        relicCards.push(obj);
      }
    }
    return relicCards;
  }

  _getRelicCardClosestPlayerSlot(relicCard: Card): number {
    const pos: Vector = relicCard.getPosition();
    const closest: number = this._find.closestOwnedCardHolderOwner(pos);
    return closest;
  }
}
