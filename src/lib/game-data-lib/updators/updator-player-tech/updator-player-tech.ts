import { Card, Vector, world } from "@tabletop-playground/api";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { CardUtil, Find, NSID, PlayerSlot } from "ttpg-darrell";
import { Tech } from "lib/tech-lib/tech/tech";

export class UpdatorPlayerTech implements IGameDataUpdator {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

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

    // Sort planet cards by player slot.
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
          .filter((name: string): boolean => name.length > 0);
      }
    );
  }
}
