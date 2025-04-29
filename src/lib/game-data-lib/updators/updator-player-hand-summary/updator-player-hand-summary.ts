import { Card, CardHolder } from "@tabletop-playground/api";
import { Find, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerHandSummary implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const cardHolder: CardHolder | undefined =
          this._find.findCardHolderBySlot(playerSlot);

        let actionCount: number = 0;
        let promissoryCount: number = 0;
        let secretCount: number = 0;

        if (cardHolder) {
          cardHolder.getCards().forEach((card: Card): void => {
            const nsid: string = NSID.get(card);
            if (nsid.startsWith("card.action:")) {
              actionCount++;
            } else if (nsid.startsWith("card.promissory")) {
              promissoryCount++;
            } else if (nsid.startsWith("card.objective.secret:")) {
              secretCount++;
            }
          });
        }

        player.handSummary = {
          "Secret Objectives": secretCount,
          Actions: actionCount,
          Promissory: promissoryCount,
        };
      }
    );
  }
}
