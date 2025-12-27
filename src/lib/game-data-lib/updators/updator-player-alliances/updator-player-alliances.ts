import { Card, Vector, world } from "@tabletop-playground/api";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { CardUtil, Find, NSID } from "ttpg-darrell";

export class UpdatorPlayerAlliances implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const allianceCards: Array<Card> = this._getLooseAllianceCards();

    gameData.players.forEach(
      (playerData: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: number =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);

        const myAllianceCards: Array<Card> = allianceCards.filter(
          (allianceCard: Card) => {
            const closestPlayerSlot: number =
              this._getAllianceCardClosestPlayerSlot(allianceCard);
            return closestPlayerSlot === playerSlot;
          }
        );

        const myAllianceColors: Array<string> = myAllianceCards
          .map((allianceCard: Card): string => {
            const allianceFactionPlayerSlot: number =
              this._getAllianceCardFactionPlayerSlot(allianceCard);
            if (allianceFactionPlayerSlot === playerSlot) {
              return ""; // for sale?
            }
            const allianceColor: string | undefined =
              TI4.playerColor.getSlotColorName(allianceFactionPlayerSlot);
            if (!allianceColor) {
              return ""; // alliance without faction (yin breakthrough?)
            }
            return allianceColor;
          })
          .filter((color: string) => color !== "");

        playerData.alliances = myAllianceColors;
      }
    );
  }

  /**
   * Find alliance cards loose on the table.
   *
   * @returns
   */
  _getLooseAllianceCards(): Array<Card> {
    const skipContained: boolean = true;
    const cardUtil: CardUtil = new CardUtil();
    const allianceCards: Array<Card> = [];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("card.alliance:") &&
        obj instanceof Card &&
        cardUtil.isLooseCard(obj)
      ) {
        allianceCards.push(obj);
      }
    }
    return allianceCards;
  }

  /**
   * Given an alliance card, find which faction it belongs to.
   *
   * @param allianceCard
   * @returns
   */
  _getAllianceCardFactionPlayerSlot(allianceCard: Card): number {
    const nsid: string = NSID.get(allianceCard);
    for (const [playerSlot, faction] of TI4.factionRegistry
      .getPlayerSlotToFaction()
      .entries()) {
      if (faction.getAllianceNsids().includes(nsid)) {
        return playerSlot;
      }
    }
    return -1;
  }

  _getAllianceCardClosestPlayerSlot(allianceCard: Card): number {
    const pos: Vector = allianceCard.getPosition();
    const closest: number = this._find.closestOwnedCardHolderOwner(pos);
    return closest;
  }
}
