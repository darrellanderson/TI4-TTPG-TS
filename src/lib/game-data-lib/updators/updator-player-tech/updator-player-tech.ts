import { Card, Player, Vector, world } from "@tabletop-playground/api";
import {
  CardUtil,
  Find,
  NSID,
  OnCardBecameSingletonOrDeck,
  PlayerSlot,
} from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { Tech } from "../../../tech-lib/tech/tech";

export class UpdatorPlayerTech implements IGameDataUpdator {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  static getTimestamp(card: Card): number {
    const data: string = card.getSavedData("timestamp");
    if (data && data.length > 0) {
      return parseInt(data, 10);
    }
    return 0;
  }

  static setTimestamp(card: Card): void {
    const oldData: string = card.getSavedData("timestamp");
    if (!oldData || oldData.length === 0) {
      const data: string = Date.now().toString();
      card.setSavedData(data, "timestamp");
    }
  }

  constructor() {
    // world.getAllObjects does not return cards in creation order.
    // Add a creation timestamp to tech cards so we can sort them by creation order.
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card, _player?: Player): void => {
        const nsid: string = NSID.get(card);
        if (card instanceof Card && nsid.startsWith("card.technology.")) {
          UpdatorPlayerTech.setTimestamp(card);
        }
      }
    );
  }

  update(gameData: GameData): void {
    const techCards: Array<Card> = [];

    const skipContained: boolean = false;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        obj instanceof Card &&
        nsid.startsWith("card.technology.") &&
        this._cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        techCards.push(obj);
      }
    }

    // Sort cards by creation order.
    techCards.sort((a: Card, b: Card): number => {
      const aTimestamp: number = UpdatorPlayerTech.getTimestamp(a);
      const bTimestamp: number = UpdatorPlayerTech.getTimestamp(b);
      if (aTimestamp !== bTimestamp) {
        return aTimestamp - bTimestamp;
      }
      // Break ties by alpha order of name.
      return a.getName().localeCompare(b.getName());
    });

    // Group cards by player slot.
    const playerSlotToCards: Map<number, Array<Card>> = new Map();
    techCards.forEach((card: Card): void => {
      const pos: Vector = card.getPosition();
      const playerSlot: PlayerSlot =
        this._find.closestOwnedCardHolderOwner(pos);
      let cards: Array<Card> | undefined = playerSlotToCards.get(playerSlot);
      if (!cards) {
        cards = [];
        playerSlotToCards.set(playerSlot, cards);
      }
      cards.push(card);
    });

    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const cards: Array<Card> = playerSlotToCards.get(playerSlot) ?? [];

        player.technologies = cards
          .map((card: Card): string => {
            const nsid: string = NSID.get(card);
            const tech: Tech | undefined = TI4.techRegistry.getByNsid(nsid);
            return tech ? tech.getName() : "";
          })
          .filter((name: string): boolean => name.length > 0)
          .filter(
            (name: string, index: number, array: Array<string>): boolean =>
              array.indexOf(name) === index
          ); // unique
      }
    );
  }
}
