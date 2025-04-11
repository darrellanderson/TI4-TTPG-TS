import { Atop, Find, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameObject, Vector, world } from "@tabletop-playground/api";

export class UpdatorPlayerCustodiansPoints implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const findNsid: string = "token:base/custodians";
    const findPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const custodiansToken: GameObject | undefined = this._find.findGameObject(
      findNsid,
      findPlayerSlot,
      skipContained
    );

    const playerSlotToControlTokenCount: Map<PlayerSlot, number> = new Map();
    if (custodiansToken) {
      const atop: Atop = new Atop(custodiansToken);
      for (const obj of world.getAllObjects(skipContained)) {
        const nsid: string = NSID.get(obj);
        const pos: Vector = obj.getPosition();
        if (nsid.startsWith("token.control:") && atop.isAtop(pos)) {
          const playerSlot: PlayerSlot = obj.getOwningPlayerSlot();
          const count: number =
            playerSlotToControlTokenCount.get(playerSlot) ?? 0;
          playerSlotToControlTokenCount.set(playerSlot, count + 1);
        }
      }
    }

    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const count: number | undefined =
          playerSlotToControlTokenCount.get(playerSlot);
        player.custodiansPoints = count ?? 0;
      }
    );
  }
}
