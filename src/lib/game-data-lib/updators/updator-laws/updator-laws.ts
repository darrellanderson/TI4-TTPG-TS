import { Card, GameObject, Vector, world } from "@tabletop-playground/api";
import { Atop, CardUtil, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorLaws implements IGameDataUpdator {
  private readonly _cardUtil: CardUtil = new CardUtil();

  update(gameData: GameData): void {
    const controlTokens: Array<GameObject> = [];
    const lawCards: Array<Card> = [];

    const skipContained: boolean = true;
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = [
      "discard-agenda",
      "active-agenda",
    ];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("card.agenda") &&
        obj instanceof Card &&
        this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
      ) {
        lawCards.push(obj);
      }

      if (nsid.startsWith("token.control:")) {
        controlTokens.push(obj);
      }
    }

    gameData.laws = lawCards
      .map((card: Card): string => {
        const cardName: string = card.getCardDetails().name;
        return cardName;
      })
      .filter(
        (value: string, index: number, self: Array<string>): boolean =>
          self.indexOf(value) === index // filter to unique values
      );

    // Per-player laws (have control tokens on them).
    gameData.players.forEach((player: PerPlayerGameData, seatIndex: number) => {
      const playerSlot: PlayerSlot =
        TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
      const playerLawCards: Array<Card> = lawCards.filter(
        (lawCard: Card): boolean => {
          const atop: Atop = new Atop(lawCard);
          for (const controlToken of controlTokens) {
            const owningPlayerSlot: number = controlToken.getOwningPlayerSlot();
            const pos: Vector = controlToken.getPosition();
            const isAtop: boolean = atop.isAtop(pos);
            if (owningPlayerSlot === playerSlot && isAtop) {
              return true;
            }
          }
          return false;
        }
      );

      player.laws = playerLawCards
        .map((card: Card): string => {
          const cardName: string = card.getCardDetails().name;
          return cardName;
        })
        .filter(
          (value: string, index: number, self: Array<string>): boolean =>
            self.indexOf(value) === index // filter to unique values
        );
    });
  }
}
